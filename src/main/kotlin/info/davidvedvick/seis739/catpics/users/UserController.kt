package info.davidvedvick.seis739.catpics.users

import info.davidvedvick.seis739.catpics.value
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("users")
class UserController(private val userRepository: UserRepository)