package info.davidvedvick.seis739.catpics.users.authorization

import org.springframework.security.authentication.AuthenticationManager
import org.springframework.web.bind.annotation.RestController

@RestController
class LoginController(private val authenticationManager: AuthenticationManager) {
}