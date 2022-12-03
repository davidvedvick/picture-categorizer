package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.users.UserRepository
import info.davidvedvick.seis739.catpics.value
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/pictures")
class PictureController(private val pictureRepository: PictureRepository, private val userRepository: UserRepository) {
    @GetMapping("/")
    fun get(pageable: Pageable): Page<Picture> = pictureRepository.findAll(pageable)

    @GetMapping("/{id}")
    fun getPicture(@PathVariable id: Long): Picture? = pictureRepository.findById(id).value

    @PostMapping("/")
    fun addPictures(@RequestParam("file") file: MultipartFile, authentication: Authentication?) : ResponseEntity<Any?> {
        val email = authentication?.name ?: return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        val fileName = file.originalFilename ?: return ResponseEntity.badRequest().build()
        val user = userRepository.findByEmail(email) ?: return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        val existingPicture = pictureRepository.findByUserIdAndFileName(user.id, fileName)
        if (existingPicture != null) return ResponseEntity.status(HttpStatus.CONFLICT).build()

        pictureRepository.save(
            Picture(
                file = file.bytes,
                fileName = file.originalFilename ?: file.name,
                user = user
            )
        )

        return ResponseEntity.accepted().build()
    }
}