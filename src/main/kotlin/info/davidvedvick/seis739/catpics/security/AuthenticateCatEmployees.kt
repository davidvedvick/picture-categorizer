package info.davidvedvick.seis739.catpics.security

interface AuthenticateCatEmployees {
    suspend fun authenticate(unauthenticatedCatEmployee: UnauthenticatedCatEmployee): AuthenticatedCatEmployee
}