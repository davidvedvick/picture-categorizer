package info.davidvedvick.seis739.catpics.security

import info.davidvedvick.seis739.catpics.users.CatEmployee
import info.davidvedvick.seis739.catpics.users.ManageCatEmployees
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.DisabledException

class UserAuthenticationManager(private val manageCatEmployees: ManageCatEmployees, private val passwordEncoder: Encoder) : AuthenticateCatEmployees {

    override suspend fun authenticate(unauthenticatedCatEmployee: UnauthenticatedCatEmployee): AuthenticatedCatEmployee =
        with (unauthenticatedCatEmployee) {
            val catEmployee = manageCatEmployees.findByEmail(email) ?: manageCatEmployees.save(
                CatEmployee(
                    email = email,
                    password = passwordEncoder.encode(password.toCharArray())
                )
            )
            if (!catEmployee.isEnabled) throw DisabledException("Account disabled")
            if (catEmployee.password.isBlank()) throw BadCredentialsException("No password")
            if (!passwordEncoder.matches(
                    password.toCharArray(),
                    catEmployee.password
                )
            ) throw BadCredentialsException("Invalid password")
            AuthenticatedCatEmployee(email, password)
        }
}