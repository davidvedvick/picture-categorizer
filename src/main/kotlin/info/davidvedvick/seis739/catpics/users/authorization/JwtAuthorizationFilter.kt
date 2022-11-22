package info.davidvedvick.seis739.catpics.users.authorization

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class JwtAuthorizationFilter(authenticationManager: AuthenticationManager) : BasicAuthenticationFilter(authenticationManager) {
    override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, chain: FilterChain) {
        request.getHeader(AuthenticationConstants.AuthHeaderKey)
            ?.takeIf { it.startsWith(AuthenticationConstants.TokenPrefix) }
            ?.let {
                JWT.require(Algorithm.HMAC512(AuthenticationConstants.Secret))
                    .build()
                    .verify(it.replace(AuthenticationConstants.TokenPrefix, ""))
            }
            ?.let { jwt ->
                val username = jwt.subject
                val role = jwt.getClaim("simple").asString()
                username
                    ?.let { UsernamePasswordAuthenticationToken(it, null, mutableListOf(SimpleGrantedAuthority(role))) }
            }
    }
}