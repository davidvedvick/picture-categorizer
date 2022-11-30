package info.davidvedvick.seis739.catpics.users

import info.davidvedvick.seis739.catpics.users.authorization.JwtUserRequest
import info.davidvedvick.seis739.catpics.users.authorization.UnauthenticatedCatEmployee
import info.davidvedvick.seis739.catpics.value
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("users")
class UserController(private val userRepository: UserRepository, private val authenticationManager: AuthenticationManager) {
    @PostMapping("/")
    fun loginUser(@RequestBody jwtUserRequest: JwtUserRequest): User {
        val user = userRepository.findByEmail(jwtUserRequest.email) ?: userRepository.save(User(email = jwtUserRequest.email, password = jwtUserRequest.password))

        val result = authenticationManager
            .authenticate(UnauthenticatedCatEmployee(jwtUserRequest.email, jwtUserRequest.password))

        SecurityContextHolder.getContext().authentication = result

        return userRepository.findByEmail(user.email) ?: userRepository.save(user)
    }
}