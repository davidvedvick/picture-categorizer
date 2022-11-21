package info.davidvedvick.seis739.catpics.users

import info.davidvedvick.seis739.catpics.getOrNull
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService

class UserLoginService(private val userRepository: UserRepository) : UserDetailsService {
    override fun loadUserByUsername(username: String?): UserDetails? {
        username ?: return null

        return userRepository.findByUserName(username)
            .getOrNull()
            ?.let {
                UserLoginDetails(it.userName, it.password)
            }
    }
}