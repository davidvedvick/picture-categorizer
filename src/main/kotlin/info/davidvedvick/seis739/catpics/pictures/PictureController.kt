package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.users.UserRepository
import info.davidvedvick.seis739.catpics.value
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/pictures")
class PictureController(private val pictureRepository: PictureRepository, private val userRepository: UserRepository) {
    @GetMapping("/")
    fun get(): List<Picture> = pictureRepository.findAll()

    @GetMapping("/{id}")
    fun getPicture(@PathVariable id: Long): Picture? = pictureRepository.findById(id).value

    @PostMapping("/")
    fun addPictures(@RequestParam("files") files: Array<MultipartFile>, authentication: Authentication?) {
        val email = authentication?.name ?: return
        val user = userRepository.findByEmail(email) ?: return

        pictureRepository.saveAll(files.map { file ->
            Picture(
                file = file.bytes,
                fileName = file.originalFilename ?: file.name,
                user = user
            )
        })
    }
}