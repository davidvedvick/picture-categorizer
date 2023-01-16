package info.davidvedvick.seis739.catpics

import com.github.jasync.sql.db.asSuspending
import com.github.jasync.sql.db.mysql.MySQLConnection
import com.github.jasync.sql.db.mysql.MySQLConnectionBuilder
import com.github.jasync.sql.db.pool.ConnectionPool
import info.davidvedvick.seis739.catpics.pictures.ManagePictures
import info.davidvedvick.seis739.catpics.pictures.PictureRepository
import info.davidvedvick.seis739.catpics.pictures.pictureRoutes
import info.davidvedvick.seis739.catpics.security.AuthenticatedCatEmployee
import info.davidvedvick.seis739.catpics.security.JwtTokenManagement
import info.davidvedvick.seis739.catpics.security.ManageJwtTokens
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import org.flywaydb.core.Flyway
import org.koin.core.module.dsl.bind
import org.koin.core.module.dsl.factoryOf
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger

fun appModule(environment: ApplicationEnvironment) = module {
	single {
		val dataSourceConfiguration = environment.config.config("datasource")
		val url = dataSourceConfiguration.property("url").getString().replace("mariadb", "mysql")
		val connectionString = "${url}?user=${dataSourceConfiguration.property("user").getString()}&password=${dataSourceConfiguration.property("password").getString()}"
		MySQLConnectionBuilder.createConnectionPool(connectionString);
	}
	factory {
		get<ConnectionPool<MySQLConnection>>().asSuspending
	}
	factoryOf(::JwtTokenManagement) { bind<ManageJwtTokens>() }
	singleOf(::PictureRepository) { bind<ManagePictures>() }
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

	install(Authentication) {
		jwt {
			// Configure jwt authentication
			validate { credential ->
				credential.payload.subject.takeIf { it.isNotEmpty() }?.let { AuthenticatedCatEmployee(it, null) }
			}
		}
	}

	configureRouting()
	configureSerialization()

	val dataSourceConfiguration = environment.config.config("datasource")
	Flyway
		.configure()
		.dataSource(
			dataSourceConfiguration.property("url").getString(),
			dataSourceConfiguration.property("user").getString(),
			dataSourceConfiguration.property("password").getString())
		.load()
		.migrate()
}

fun Application.configureRouting() {
	pictureRoutes()
}

fun Application.configureSerialization() {
	install(ContentNegotiation) {
		json()
	}
}