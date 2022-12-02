package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.value
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.security.Principal

@RestController
@RequestMapping("/pictures")
class PictureController(private val pictureRepository: PictureRepository) {
    @GetMapping("/")
    fun get(): List<Picture> = pictureRepository.findAll()

    @GetMapping("/{id}")
    fun getPicture(@PathVariable id: Long): Picture? = pictureRepository.findById(id).value

    @PostMapping("/")
    fun addPicture(@RequestParam("file") file: MultipartFile, @RequestParam("picture") picture: Picture, principal: Principal) {
        if (principal.name != picture.user?.email) return

        picture.file = file.bytes
        picture.fileName = file.name
        pictureRepository.save(picture)
    }
}