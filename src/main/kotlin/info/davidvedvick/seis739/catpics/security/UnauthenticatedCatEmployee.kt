package info.davidvedvick.seis739.catpics.security

import io.ktor.server.auth.*

class UnauthenticatedCatEmployee(val email: String, val password: String) : Credential