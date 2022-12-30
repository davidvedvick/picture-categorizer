package info.davidvedvick.seis739.catpics.security

import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class JwtAuthorizationFilter(authenticationManager: AuthenticationManager, private val jwtTokens: ManageJwtTokens) : BasicAuthenticationFilter(authenticationManager) {
    override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, chain: FilterChain) {
        SecurityContextHolder.getContext().authentication = request.getHeader(AuthenticationConstants.AuthHeaderKey)
            ?.let(jwtTokens::decodeToken)

        chain.doFilter(request, response)
    }
}