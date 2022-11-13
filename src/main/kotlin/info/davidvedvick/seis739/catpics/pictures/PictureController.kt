package info.davidvedvick.seis739.catpics.pictures

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody

@Controller
class PictureController(private val pictureRepository: PictureRepository) {
    @GetMapping
    fun get(): List<Picture> = pictureRepository.findAll()

    @GetMapping("/{id}")
    fun getPicture(@PathVariable id: Long): Picture = pictureRepository.findById(id).orElse(null)
}