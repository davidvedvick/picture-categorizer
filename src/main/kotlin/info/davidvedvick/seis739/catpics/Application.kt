package info.davidvedvick.seis739.catpics

import com.github.jasync.sql.db.asSuspending
import com.github.jasync.sql.db.mysql.MySQLConnection
import com.github.jasync.sql.db.mysql.MySQLConnectionBuilder
import com.github.jasync.sql.db.pool.ConnectionPool
import info.davidvedvick.seis739.catpics.pictures.ManagePictures
import info.davidvedvick.seis739.catpics.pictures.PictureRepository
import info.davidvedvick.seis739.catpics.pictures.pictureRoutes
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import org.koin.core.module.dsl.bind
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger

fun appModule(environment: ApplicationEnvironment) = module {
	single {
		MySQLConnectionBuilder.createConnectionPool(
			"${environment.config.property("datasource.url")}?user=${environment.config.property("datasource.user")}&password=${environment.config.property("datasource.password")}");
	}
	factory {
		get<ConnectionPool<MySQLConnection>>().asSuspending
	}
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
		}
	}

	configureRouting()
	configureSerialization()
}

fun Application.configureRouting() {
	pictureRoutes()
}

fun Application.configureSerialization() {
	install(ContentNegotiation) {
		json()
	}
}