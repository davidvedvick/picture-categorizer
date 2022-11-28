package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.users.UserRepository
import info.davidvedvick.seis739.catpics.value
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/pictures")
class PictureController(private val pictureRepository: PictureRepository, private val userRepository: UserRepository) {
    @GetMapping("/")
    fun get(): List<Picture> = pictureRepository.findAll()

    @GetMapping("/{id}")
    fun getPicture(@PathVariable id: Long): Picture? = pictureRepository.findById(id).value

    @PostMapping("/")
    fun addPicture(picture: Picture) {
        pictureRepository.save(picture)
    }
}