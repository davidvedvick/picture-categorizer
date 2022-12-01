package info.davidvedvick.seis739.catpics.users.authorization

interface BuildJwtTokens {
    fun generateToken(authenticatedEmployee: AuthenticatedCatEmployee): JwtToken
}
