package info.davidvedvick.seis739.catpics.users

import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Component

@Component
class UserAuthenticationProvider(private val userRepository: UserRepository) : AuthenticationProvider {
    override fun authenticate(authentication: Authentication?): Authentication? {
        return authentication?.run {
            val name = authentication.name
            val password = authentication.credentials.toString()

            userRepository
                .findByUserName(name)
                .takeIf { it.isPresent }
                ?.get()
                ?.takeIf { it.password == password }
                ?.let { UsernamePasswordAuthenticationToken(name, password) }
        }
    }

    override fun supports(authentication: Class<*>?): Boolean {
        TODO("Not yet implemented")
    }
}