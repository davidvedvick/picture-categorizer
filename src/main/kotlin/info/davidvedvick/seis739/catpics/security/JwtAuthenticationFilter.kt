package info.davidvedvick.seis739.catpics.security

import com.fasterxml.jackson.databind.ObjectMapper
import info.davidvedvick.seis739.catpics.ApiConfigurationConstants
import info.davidvedvick.seis739.catpics.cls
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.core.Authentication
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class JwtAuthenticationFilter(authenticationManager: AuthenticationManager, private val jwtTokenBuilder: ManageJwtTokens) : AbstractAuthenticationProcessingFilter("${ApiConfigurationConstants.pathPrefix}/login", authenticationManager) {
    override fun attemptAuthentication(request: HttpServletRequest?, response: HttpServletResponse?): Authentication? =
        request
            ?.inputStream
            ?.let { ObjectMapper().readValue(it, cls<UserLoginRequest>())}
            ?.let {
                authenticationManager.authenticate(UnauthenticatedCatEmployee(it.email, it.password))
            }

    override fun successfulAuthentication(request: HttpServletRequest?, response: HttpServletResponse?, chain: FilterChain?, authResult: Authentication?) {
        response?.writer?.apply {
            val catEmployee = authResult as? AuthenticatedCatEmployee ?: return
            val token = jwtTokenBuilder.generateToken(catEmployee)
            print(ObjectMapper().writeValueAsString(token))
        }
    }
}