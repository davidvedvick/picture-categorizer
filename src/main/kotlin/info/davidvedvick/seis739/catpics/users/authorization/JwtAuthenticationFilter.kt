package info.davidvedvick.seis739.catpics.users.authorization

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.fasterxml.jackson.databind.ObjectMapper
import info.davidvedvick.seis739.catpics.cls
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import java.util.*
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class JwtAuthenticationFilter(authenticationManager: AuthenticationManager) : UsernamePasswordAuthenticationFilter(authenticationManager) {
    override fun attemptAuthentication(request: HttpServletRequest?, response: HttpServletResponse?): Authentication? =
        request
            ?.inputStream
            ?.let { ObjectMapper().readValue(it, cls<UserLoginDetails>())}
            ?.let {
                authenticationManager.authenticate(UsernamePasswordAuthenticationToken(it.username, it.password))
            }

    override fun successfulAuthentication(request: HttpServletRequest?, response: HttpServletResponse?, chain: FilterChain?, authResult: Authentication?) {
        val token = JWT.create()
            .withSubject(authResult?.name ?: return)
            .withExpiresAt(Date(System.currentTimeMillis() + AuthenticationConstants.ExpirationDuration))
            .sign(Algorithm.HMAC512(AuthenticationConstants.Secret.toByteArray()))

        response?.addHeader(AuthenticationConstants.AuthHeaderKey, "${AuthenticationConstants.TokenPrefix} $token")
    }
}