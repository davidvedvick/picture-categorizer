package info.davidvedvick.seis739.catpics.security

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.stereotype.Component

@EnableConfigurationProperties
@Component
@ConfigurationProperties("app.authentication")
class AuthenticationConfiguration {
    var secret: String = ""
}