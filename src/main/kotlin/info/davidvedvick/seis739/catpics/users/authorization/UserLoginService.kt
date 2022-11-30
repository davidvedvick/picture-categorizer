package info.davidvedvick.seis739.catpics.users.authorization

import info.davidvedvick.seis739.catpics.users.UserRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Component

@Component
class UserLoginService(private val userRepository: UserRepository) : UserDetailsService {
    override fun loadUserByUsername(username: String?): UserDetails? =
        username
            ?.let(userRepository::findByEmail)
            ?.run {
                UserLoginDetails(id, email, password)
            }
}