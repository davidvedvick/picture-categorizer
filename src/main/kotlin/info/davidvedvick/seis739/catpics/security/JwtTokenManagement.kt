package info.davidvedvick.seis739.catpics.security

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import java.util.*

class JwtTokenManagement(private val authenticationConfiguration: AuthenticationConfiguration) : ManageJwtTokens {
    private val signingAlgorithm by lazy { Algorithm.HMAC512(authenticationConfiguration.secret) }

    override fun generateToken(authenticatedEmployee: AuthenticatedCatEmployee): JwtToken =
        JWT.create()
            .withSubject(authenticatedEmployee.email)
            .withExpiresAt(Date(System.currentTimeMillis() + AuthenticationConstants.ExpirationDuration))
            .sign(signingAlgorithm)
            .let { JwtToken("${AuthenticationConstants.TokenPrefix} $it", AuthenticationConstants.ExpirationDuration) }

    override fun decodeToken(token: String): AuthenticatedCatEmployee? =
        token.takeIf { it.startsWith(AuthenticationConstants.TokenPrefix) }
            ?.let {
                JWT.require(signingAlgorithm)
                    .build()
                    .verify(it.replace(AuthenticationConstants.TokenPrefix, "").trim())
            }
            ?.subject
            ?.let { AuthenticatedCatEmployee(it, null) }
}