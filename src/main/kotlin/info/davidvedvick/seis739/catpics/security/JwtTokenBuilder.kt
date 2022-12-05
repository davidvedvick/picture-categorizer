package info.davidvedvick.seis739.catpics.security

import com.auth0.jwt.JWT
import org.springframework.stereotype.Component
import java.util.*

@Component
class JwtTokenBuilder : BuildJwtTokens {
    override fun generateToken(authenticatedEmployee: AuthenticatedCatEmployee): JwtToken =
        JWT.create()
            .withSubject(authenticatedEmployee.name)
            .withClaim("simple", "simple")
            .withExpiresAt(Date(System.currentTimeMillis() + AuthenticationConstants.ExpirationDuration))
            .sign(AuthenticationConstants.JwtSigningAlgorithm)
            .let(::JwtToken)
}