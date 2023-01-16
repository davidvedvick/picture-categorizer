package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.users.CatEmployeeRepository
import info.davidvedvick.seis739.catpics.value
import org.springframework.core.io.InputStreamResource
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/pictures")
class PictureController(private val pictureRepository: ManagePictures, private val catEmployeeRepository: CatEmployeeRepository) {
    @GetMapping
    fun get(pageable: Pageable): Page<PictureResponse> {
        throw NotImplementedError()
    }

    @GetMapping("/{id}")
    fun getPicture(@PathVariable id: Long): PictureResponse? {
        throw NotImplementedError()
    }

    @GetMapping("/{id}/file")
    fun getFile(@PathVariable id: Long): ResponseEntity<InputStreamResource> {
        throw NotImplementedError()
    }

    @PostMapping("/")
    fun addPictures(@RequestParam("file") file: MultipartFile, authentication: Authentication?) : ResponseEntity<PictureResponse?> {
        throw NotImplementedError()
    }
}