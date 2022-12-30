package info.davidvedvick.seis739.catpics.security

import info.davidvedvick.seis739.catpics.ApiConfigurationConstants
import info.davidvedvick.seis739.catpics.cls
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfiguration(
    private val authenticationManager: AuthenticationManager,
    private val jwtTokenBuilder: ManageJwtTokens,
) {

    @Bean
    fun configure(httpSecurity: HttpSecurity): SecurityFilterChain? {
        httpSecurity.cors().and().csrf().disable()
            .authorizeRequests()
            // we only really care about protecting picture uploads, everything else is public
            .mvcMatchers(HttpMethod.POST,"${ApiConfigurationConstants.pathPrefix}/pictures")
            .authenticated()
            .and()
            .addFilterAfter(JwtAuthenticationFilter(authenticationManager, jwtTokenBuilder), cls<JwtAuthorizationFilter>())
            .addFilter(JwtAuthorizationFilter(authenticationManager, jwtTokenBuilder))
            // this disables session creation on Spring Security
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)

        return httpSecurity.build()
    }
}