package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.value
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
@RequestMapping("/pictures")
class PictureController(private val pictureRepository: PictureRepository) {
    @GetMapping("/")
    fun get(): List<Picture> = pictureRepository.findAll()

    @GetMapping("/{id}")
    fun getPicture(@PathVariable id: Long): Picture? = pictureRepository.findById(id).value

    @PostMapping("/")
    fun addPicture(@RequestBody picture: Picture, principal: Principal) {
        if (principal.name == picture.user?.email)
            pictureRepository.save(picture)
    }
}