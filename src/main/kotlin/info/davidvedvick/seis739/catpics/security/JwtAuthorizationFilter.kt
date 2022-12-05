package info.davidvedvick.seis739.catpics.security

import com.auth0.jwt.JWT
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class JwtAuthorizationFilter(authenticationManager: AuthenticationManager) : BasicAuthenticationFilter(authenticationManager) {
    override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, chain: FilterChain) {
        request.getHeader(AuthenticationConstants.AuthHeaderKey)
            ?.takeIf { it.startsWith(AuthenticationConstants.TokenPrefix) }
            ?.let {
                JWT.require(AuthenticationConstants.JwtSigningAlgorithm)
                    .build()
                    .verify(it.replace(AuthenticationConstants.TokenPrefix, "").trim())
            }
            ?.let { jwt ->
                val username = jwt.subject
                username
                    ?.let {
                        AuthenticatedCatEmployee(it, null)
                    }
                    ?.also {
                        SecurityContextHolder.getContext().authentication = it
                    }
            }

        chain.doFilter(request, response)
    }
}