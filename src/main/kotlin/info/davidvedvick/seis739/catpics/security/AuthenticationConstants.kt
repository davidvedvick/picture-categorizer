package info.davidvedvick.seis739.catpics.security

import com.auth0.jwt.algorithms.Algorithm

object AuthenticationConstants {
    const val AuthHeaderKey = "Authorization"
    const val TokenPrefix = "Bearer"

    const val ExpirationDuration = 86_400_000 // 1 day

    private const val Secret = "5037723c-f5f8-49c4-b161-d29733d034ff"
    val JwtSigningAlgorithm: Algorithm by lazy { Algorithm.HMAC512(Secret) }
}