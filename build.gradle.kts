import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	id("org.springframework.boot") version "2.7.3"
	id("io.spring.dependency-management") version "1.0.13.RELEASE"
	id("org.siouan.frontend-jdk11") version "6.0.0"
	kotlin("jvm") version "1.6.21"
	kotlin("plugin.spring") version "1.6.21"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
	mavenCentral()
}

dependencies {
	val ktorVersion = "2.2.2"
	val koinKtor= "3.3.0"

	runtimeOnly("org.jetbrains.kotlin:kotlin-reflect:1.8.0")

	implementation("io.ktor:ktor-server-core:$ktorVersion")
	implementation("io.ktor:ktor-server-netty:$ktorVersion")
	implementation("io.ktor:ktor-server-content-negotiation:$ktorVersion")
	implementation("io.ktor:ktor-serialization-kotlinx-json:$ktorVersion")
//	implementation("ch.qos.logback:logback-classic:$logback_version")
	implementation("org.springframework.boot:spring-boot-starter")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-data-rest")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.data:spring-data-commons:2.7.2")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
	implementation("org.jetbrains.exposed:exposed-core:0.41.1")
	implementation("org.flywaydb:flyway-mysql")
	implementation("org.mariadb.jdbc:mariadb-java-client:3.1.0")
	implementation("com.auth0:java-jwt:4.2.1")
	// Koin for Ktor
	implementation("io.insert-koin:koin-ktor:$koinKtor")
// SLF4J Logger
	implementation("io.insert-koin:koin-logger-slf4j:$koinKtor")
	implementation("com.github.jasync-sql:jasync-common:2.1.8")
	implementation("com.github.jasync-sql:jasync-mysql:2.1.8")
	annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
	testImplementation("io.ktor:ktor-server-test-host:$ktorVersion")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("io.mockk:mockk:1.13.2")
	testImplementation("org.amshove.kluent:kluent:1.72")
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit:1.7.21")
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

frontend {
	nodeVersion.set("18.12.1")
	packageJsonDirectory.set(File("frontend"))
	assembleScript.set("run publish")
	cleanScript.set("run clean")
}
