package info.davidvedvick.seis739.catpics.security

object AuthenticationConstants {
    const val AuthHeaderKey = "Authorization"
    const val TokenPrefix = "Bearer"

    const val ExpirationDuration = 86_400_000 // 1 day
}