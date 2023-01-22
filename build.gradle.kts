import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	application
	id("org.siouan.frontend-jdk11") version "6.0.0"
	kotlin("jvm") version "1.6.21"
	kotlin("plugin.serialization") version "1.4.32"
	id("io.ktor.plugin") version "2.2.2"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
	mavenCentral()
}

application {
	mainClass.set("info.davidvedvick.seis739.catpics.ApplicationKt")
}

dependencies {
	implementation("io.ktor:ktor-server-caching-headers-jvm:2.2.2")
    val ktorVersion = "2.2.2"
	val koinKtor = "3.3.0"
	val logbackVersion = "1.3.5"

	implementation("io.ktor:ktor-server-core:$ktorVersion")
	implementation("io.ktor:ktor-server-netty:$ktorVersion")
	implementation("io.ktor:ktor-server-content-negotiation:$ktorVersion")
	implementation("io.ktor:ktor-serialization-kotlinx-json:$ktorVersion")
	implementation("io.ktor:ktor-server-caching-headers:$ktorVersion")
	implementation("io.ktor:ktor-server-auth:$ktorVersion")
	implementation("io.ktor:ktor-server-auth-jwt:$ktorVersion")
	implementation("ch.qos.logback:logback-classic:$logbackVersion")
	implementation("org.springframework.boot:spring-boot-starter-security:2.7.8")
	implementation("org.jetbrains.kotlin:kotlin-reflect:1.6.21")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
	implementation("org.flywaydb:flyway-mysql:9.12.0")
	implementation("org.mariadb.jdbc:mariadb-java-client:3.1.0")
	implementation("io.insert-koin:koin-ktor:$koinKtor")
	implementation("io.insert-koin:koin-logger-slf4j:$koinKtor")
	implementation("com.github.jasync-sql:jasync-common:2.1.8")
	implementation("com.github.jasync-sql:jasync-mysql:2.1.8")
	implementation("at.favre.lib:bcrypt:0.9.0")
	testImplementation("io.ktor:ktor-server-test-host:$ktorVersion")
	testImplementation("io.mockk:mockk:1.13.2")
	testImplementation("org.amshove.kluent:kluent:1.72")
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit:1.7.21")
	implementation("org.junit.jupiter:junit-jupiter:5.9.2")
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "1.8"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks.withType<Jar> {
	manifest {
		attributes["Main-Class"] = "info.davidvedvick.seis739.catpics.ApplicationKt"
	}
}

frontend {
	nodeVersion.set("18.12.1")
	packageJsonDirectory.set(File("frontend"))
	assembleScript.set("run publish")
	cleanScript.set("run clean")
}
