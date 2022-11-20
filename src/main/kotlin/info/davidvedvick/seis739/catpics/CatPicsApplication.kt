package info.davidvedvick.seis739.catpics

import org.flywaydb.core.Flyway
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.core.env.Environment
import org.springframework.core.env.get

@SpringBootApplication
class CatPicsApplication(private val env: Environment) {

	private val logger by lazyLogger<CatPicsApplication>()

	@Bean
	fun runner(context: ApplicationContext): CommandLineRunner = CommandLineRunner {
		val dataSource = env["spring.datasource.url"]

		logger.info("Datasource: $dataSource")

		Flyway
			.configure()
			.dataSource(dataSource, "cat", "scratch")
			.load()
			.migrate()
	}
}

fun main(args: Array<String>) {
	runApplication<CatPicsApplication>(*args)
}
