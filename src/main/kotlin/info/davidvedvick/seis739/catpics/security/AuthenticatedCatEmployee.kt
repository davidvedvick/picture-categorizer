package info.davidvedvick.seis739.catpics.security

import io.ktor.server.auth.*

class AuthenticatedCatEmployee(val email: String, val password: String?)
    : Credential