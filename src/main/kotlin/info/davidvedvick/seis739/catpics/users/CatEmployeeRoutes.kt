package info.davidvedvick.seis739.catpics.users

import info.davidvedvick.seis739.catpics.security.*
import io.ktor.http.*
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
            val userLoginRequest = call.receive<UserLoginRequest>()
            val unauthenticatedCatEmployee = UnauthenticatedCatEmployee(userLoginRequest.email, userLoginRequest.password)

            when (val catEmployee = authenticationManager.authenticate(unauthenticatedCatEmployee)) {
                is AuthenticatedCatEmployee -> call.respond(manageJwtTokens.generateToken(catEmployee))
                is BadCatEmployeeCredentials -> call.respond(HttpStatusCode.BadRequest)
                else -> call.respond(HttpStatusCode.Unauthorized)
            }
        }
    }
}