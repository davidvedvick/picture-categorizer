package info.davidvedvick.seis739.catpics.security

interface ManageJwtTokens {
    fun generateToken(authenticatedEmployee: AuthenticatedCatEmployee): JwtToken

    fun decodeToken(token: String): AuthenticatedCatEmployee?
}
