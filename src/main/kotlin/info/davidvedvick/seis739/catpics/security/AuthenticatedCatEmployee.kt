package info.davidvedvick.seis739.catpics.security

import io.ktor.server.auth.*

class AuthenticatedCatEmployee(email: String, password: String)
    : CatEmployeeCredentials(email, password), Principal