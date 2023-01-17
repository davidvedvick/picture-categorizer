package info.davidvedvick.seis739.catpics.users

import info.davidvedvick.seis739.catpics.security.AuthenticateCatEmployees
import info.davidvedvick.seis739.catpics.security.ManageJwtTokens
import info.davidvedvick.seis739.catpics.security.UnauthenticatedCatEmployee
import info.davidvedvick.seis739.catpics.security.UserLoginRequest
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.DisabledException
import org.springframework.security.core.AuthenticationException

fun Application.catEmployeeRoutes() {
    val authenticationManager by inject<AuthenticateCatEmployees>()
    val manageJwtTokens by inject<ManageJwtTokens>()

    routing {
        post("/api/login") {
            val userLoginRequest = call.receive<UserLoginRequest>()
            val unauthenticatedCatEmployee = UnauthenticatedCatEmployee(userLoginRequest.email, userLoginRequest.password)
            try {
                val authenticatedCatEmployee = authenticationManager.authenticate(unauthenticatedCatEmployee)
                val token = manageJwtTokens.generateToken(authenticatedCatEmployee)
                call.respond(token)
            } catch (e: DisabledException) {
                call.respond(HttpStatusCode.Unauthorized)
            } catch (e: BadCredentialsException) {
                call.respond(HttpStatusCode.BadRequest)
            } catch (e: AuthenticationException) {
                call.respond(HttpStatusCode.Unauthorized)
            }
        }
    }
}