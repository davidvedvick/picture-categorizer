package info.davidvedvick.seis739.catpics

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.builder.SpringApplicationBuilder

@SpringBootApplication
class CatPicsApplication

fun main(args: Array<String>) {
	SpringApplicationBuilder(cls<CatPicsApplication>())
		.lazyInitialization(true)
		.build(*args)
		.run()
}
