package info.davidvedvick.seis739.catpics.security

interface BuildJwtTokens {
    fun generateToken(authenticatedEmployee: AuthenticatedCatEmployee): JwtToken
}
