package info.davidvedvick.seis739.catpics.users

import info.davidvedvick.seis739.catpics.security.AuthenticateCatEmployees
import info.davidvedvick.seis739.catpics.security.ManageJwtTokens
import info.davidvedvick.seis739.catpics.security.UnauthenticatedCatEmployee
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject

fun Application.catEmployeeRoutes() {
    val authenticationManager by inject<AuthenticateCatEmployees>()
    val manageJwtTokens by inject<ManageJwtTokens>()

    routing {
        post("/api/login") {
            val userLoginRequest = call.receive<UnauthenticatedCatEmployee>()
            val authenticatedCatEmployee = authenticationManager.authenticate(userLoginRequest)
            val token = manageJwtTokens.generateToken(authenticatedCatEmployee)
            call.respond(token)
        }
    }
}