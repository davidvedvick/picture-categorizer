package info.davidvedvick.seis739.catpics

import info.davidvedvick.seis739.catpics.users.authorization.BuildJwtTokens
import info.davidvedvick.seis739.catpics.users.authorization.JwtAuthenticationFilter
import info.davidvedvick.seis739.catpics.users.authorization.JwtAuthorizationFilter
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
    private val jwtTokenBuilder: BuildJwtTokens,
) {

    @Bean
    fun configure(httpSecurity: HttpSecurity): SecurityFilterChain? {
        httpSecurity.cors().and().csrf().disable()
            .authorizeRequests()
            // we only really care about protecting picture uploads, everything else is public
            .mvcMatchers(HttpMethod.POST,"/pictures")
            .authenticated()
            .and()
            .addFilter(JwtAuthenticationFilter(authenticationManager, jwtTokenBuilder))
            .addFilter(JwtAuthorizationFilter(authenticationManager))
            // this disables session creation on Spring Security
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)

        return httpSecurity.build()
    }
}