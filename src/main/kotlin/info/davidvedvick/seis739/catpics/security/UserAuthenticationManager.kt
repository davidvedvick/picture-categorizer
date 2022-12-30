package info.davidvedvick.seis739.catpics.security

import info.davidvedvick.seis739.catpics.users.User
import info.davidvedvick.seis739.catpics.users.UserRepository
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.DisabledException
import org.springframework.security.core.Authentication
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Component
class UserAuthenticationManager(private val userRepository: UserRepository, private val passwordEncoder: PasswordEncoder) : AuthenticationManager {
    override fun authenticate(authentication: Authentication?): Authentication? = (authentication as? UnauthenticatedCatEmployee)?.run {
        val user = userRepository.findByEmail(email) ?: userRepository.save(User(email = email, password = passwordEncoder.encode(password)))
        if (!user.isEnabled) throw DisabledException("Account disabled")
        if (user.password.isBlank()) throw BadCredentialsException("No password")
        if (!passwordEncoder.matches(password, user.password)) throw BadCredentialsException("Invalid password")
        AuthenticatedCatEmployee(email, password)
    }
}