package info.davidvedvick.seis739.catpics.users.authorization

import info.davidvedvick.seis739.catpics.users.UserRepository
import info.davidvedvick.seis739.catpics.value
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService

class UserLoginService(private val userRepository: UserRepository) : UserDetailsService {
    override fun loadUserByUsername(username: String?): UserDetails? =
        username
            ?.let(userRepository::findByEmail)
            ?.value
            ?.run {
                UserLoginDetails(id, email, password)
            }
}