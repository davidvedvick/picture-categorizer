package info.davidvedvick.seis739.catpics.users.authorization

object AuthenticationConstants {
    const val AuthHeaderKey = "Authorization"
    const val TokenPrefix = "Bearer "

    const val Secret = "5037723c-f5f8-49c4-b161-d29733d034ff"
    const val ExpirationDuration = 86_400_000 // 1 day
}