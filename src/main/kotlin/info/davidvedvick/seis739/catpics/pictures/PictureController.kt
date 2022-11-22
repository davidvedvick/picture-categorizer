package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.users.UserRepository
import info.davidvedvick.seis739.catpics.value
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
@RequestMapping("/picture")
class PictureController(private val pictureRepository: PictureRepository, private val userRepository: UserRepository) {
    @GetMapping("/")
    fun get(): List<Picture> = pictureRepository.findAll()

    fun getUserPictures(principal: Principal): List<Picture> =
        userRepository
            .findByUserName(principal.name)
            .value
            ?.id
            ?.let(pictureRepository::findByUserId)
            ?: emptyList()

    @GetMapping("/{id}")
    fun getPicture(@PathVariable id: Long): Picture? = pictureRepository.findById(id).value
}