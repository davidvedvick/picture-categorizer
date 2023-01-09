package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.users.CatEmployeeRepository
import info.davidvedvick.seis739.catpics.value
import org.springframework.core.io.InputStreamResource
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.CacheControl
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.io.ByteArrayInputStream
import java.net.URLConnection
import java.util.concurrent.TimeUnit

@RestController
@RequestMapping("/pictures")
class PictureController(private val pictureRepository: PictureRepository, private val catEmployeeRepository: CatEmployeeRepository) {
    @GetMapping
    fun get(pageable: Pageable): Page<PictureResponse> = pictureRepository.findAll(pageable).map { p -> p.toPictureResponse() }

    @GetMapping("/{id}")
    fun getPicture(@PathVariable id: Long): PictureResponse? = pictureRepository.findById(id).value?.toPictureResponse()

    @GetMapping("/{id}/file")
    fun getFile(@PathVariable id: Long): ResponseEntity<InputStreamResource> = pictureRepository.findById(id).value
        ?.let { p ->
            p.file
                .let(::ByteArrayInputStream)
                .let { inputStream ->
                    val contentType = URLConnection.guessContentTypeFromStream(inputStream).split("/")

                    ResponseEntity.ok()
                        .cacheControl(CacheControl.maxAge(30, TimeUnit.DAYS))
                        .contentType(MediaType(contentType[0], contentType[1]))
                        .body(InputStreamResource(inputStream))
                }
        } ?: ResponseEntity.notFound().build()

    @PostMapping("/")
    fun addPictures(@RequestParam("file") file: MultipartFile, authentication: Authentication?) : ResponseEntity<PictureResponse?> {
        val email = authentication?.name ?: return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        val fileName = file.originalFilename ?: return ResponseEntity.badRequest().build()
        val employee = catEmployeeRepository.findByEmail(email) ?: return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        val existingPicture = pictureRepository.findByCatEmployeeIdAndFileName(employee.id, fileName)
        if (existingPicture != null) return ResponseEntity.status(HttpStatus.CONFLICT).build()

        val picture = pictureRepository.save(
            Picture(
                file = file.bytes,
                fileName = fileName,
                catEmployee = employee
            )
        )

        return ResponseEntity.accepted().body(picture.toPictureResponse())
    }
}