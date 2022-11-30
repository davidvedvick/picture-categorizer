package info.davidvedvick.seis739.catpics.users.authorization

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import org.springframework.stereotype.Component
import java.util.*

@Component
class JwtTokenBuilder : BuildJwtTokens {
    override fun generateToken(authenticatedEmployee: AuthenticatedCatEmployee): JwtToken =
        JWT.create()
            .withSubject(authenticatedEmployee.name)
            .withExpiresAt(Date(System.currentTimeMillis() + AuthenticationConstants.ExpirationDuration))
            .sign(Algorithm.HMAC512(AuthenticationConstants.Secret.toByteArray()))
            .let(::JwtToken)
}