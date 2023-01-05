package info.davidvedvick.seis739.catpics.security

import info.davidvedvick.seis739.catpics.users.CatEmployee
import info.davidvedvick.seis739.catpics.users.CatEmployeeRepository
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.DisabledException
import org.springframework.security.core.Authentication
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Component
class UserAuthenticationManager(private val catEmployeeRepository: CatEmployeeRepository, private val passwordEncoder: PasswordEncoder) : AuthenticationManager {
    override fun authenticate(authentication: Authentication?): Authentication? = (authentication as? UnauthenticatedCatEmployee)?.run {
        val catEmployee = catEmployeeRepository.findByEmail(email) ?: catEmployeeRepository.save(CatEmployee(email = email, password = passwordEncoder.encode(password)))
        if (!catEmployee.isEnabled) throw DisabledException("Account disabled")
        if (catEmployee.password.isBlank()) throw BadCredentialsException("No password")
        if (!passwordEncoder.matches(password, catEmployee.password)) throw BadCredentialsException("Invalid password")
        AuthenticatedCatEmployee(email, password)
    }
}