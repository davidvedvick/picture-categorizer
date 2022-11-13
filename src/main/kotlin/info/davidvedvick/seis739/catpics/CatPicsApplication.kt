package info.davidvedvick.seis739.catpics

import org.flywaydb.core.Flyway
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class CatPicsApplication

fun main(args: Array<String>) {
	Flyway
		.configure()
		.dataSource("localhost:5432/catpics", "cat", "scratch")
		.load()
		.migrate()

	runApplication<CatPicsApplication>(*args)
}
