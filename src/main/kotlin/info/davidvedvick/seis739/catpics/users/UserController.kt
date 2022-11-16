package info.davidvedvick.seis739.catpics.users

import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("users")
class UserController(private val userRepository: UserRepository) {
    @PostMapping("/")
    fun addUser(@RequestBody user: User) = userRepository.save(user)
}