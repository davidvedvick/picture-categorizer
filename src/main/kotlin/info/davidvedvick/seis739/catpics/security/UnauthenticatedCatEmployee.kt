package info.davidvedvick.seis739.catpics.security

import io.ktor.server.auth.*

class UnauthenticatedCatEmployee(email: String, password: String)
    : CatEmployeeCredentials(email, password), Credential