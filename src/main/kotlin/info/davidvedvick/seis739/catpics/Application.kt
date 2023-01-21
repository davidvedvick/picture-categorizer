package info.davidvedvick.seis739.catpics

import com.github.jasync.sql.db.asSuspending
import com.github.jasync.sql.db.mysql.MySQLConnection
import com.github.jasync.sql.db.mysql.MySQLConnectionBuilder
import com.github.jasync.sql.db.pool.ConnectionPool
import info.davidvedvick.seis739.catpics.pictures.*
import info.davidvedvick.seis739.catpics.security.*
import info.davidvedvick.seis739.catpics.users.CatEmployeeRepository
import info.davidvedvick.seis739.catpics.users.ManageCatEmployees
import info.davidvedvick.seis739.catpics.users.catEmployeeRoutes
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.engine.*
import io.ktor.server.http.content.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.routing.*
import org.flywaydb.core.Flyway
import org.koin.core.module.dsl.bind
import org.koin.core.module.dsl.factoryOf
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.module
import org.koin.ktor.ext.inject
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import java.io.File
import java.lang.Long.min
import kotlin.time.Duration.Companion.seconds

fun appModule(environment: ApplicationEnvironment) = module {
	single {
		val dataSourceConfiguration = environment.config.config("datasource")
		val url = dataSourceConfiguration.property("url").getString().replace("mariadb", "mysql")
		MySQLConnectionBuilder.createConnectionPool(url) {
			username = dataSourceConfiguration.property("user").getString()
			password = dataSourceConfiguration.property("password").getString()
		}
	}
	factory {
		get<ConnectionPool<MySQLConnection>>().asSuspending
	}
	single {
		val authenticationSecret = environment.config.property("authentication.secret").getString()
		AuthenticationConfiguration().apply {
			secret = authenticationSecret
		}
	}

	factoryOf(::JwtTokenManagement) { bind<ManageJwtTokens>() }
	factoryOf(::UserAuthenticationManager) { bind<AuthenticateCatEmployees>() }
	factoryOf(::PictureService) { bind<ServePictures>() }
	singleOf(::PictureRepository) { bind<ManagePictures>() }
	singleOf(::CatEmployeeRepository) { bind<ManageCatEmployees>() }
	single<PasswordEncoder> { BCryptPasswordEncoder() }
}

fun main(args: Array<String>) {
	embeddedServer(
		Netty,
		commandLineEnvironment(args),
	).start(wait = true)
}

fun Application.main() {
	install(Koin) {
		slf4jLogger()
		modules(appModule(environment))
	}

	val jwtTokenManagement by inject<ManageJwtTokens>()

	install(Authentication) {
		bearer {
			authenticate { tokenCredential ->
				jwtTokenManagement.decodeToken(tokenCredential.token)
			}
		}
	}

	configureRouting()
	configureSerialization()

	val dataSourceConfiguration = environment.config.config("datasource")

	var sleepTime = 1.seconds.inWholeMilliseconds
	for (i in 1..30) {
		try {
			Flyway
				.configure()
				.dataSource(
					dataSourceConfiguration.property("url").getString(),
					dataSourceConfiguration.property("user").getString(),
					dataSourceConfiguration.property("password").getString()
				)
				.load()
				.migrate()
			break
		} catch(e: Exception) {
			// ignored
		}

		Thread.sleep(sleepTime)
		sleepTime = min(sleepTime * 2, 30.seconds.inWholeMilliseconds)
	}
}

fun Application.configureRouting() {

	routing {
		static("/") {
			staticBasePackage = "static"
			resources(".")
			defaultResource("index.html")

			val configuredStaticPath = environment?.config?.propertyOrNull("static-content")?.getString()
			if (configuredStaticPath != null) {
				staticRootFolder = File(configuredStaticPath)
				files(".")
			}
		}
	}

	pictureRoutes()
	catEmployeeRoutes()
}

fun Application.configureSerialization() {
	install(ContentNegotiation) {
		json()
	}
}