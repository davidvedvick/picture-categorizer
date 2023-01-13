package info.davidvedvick.seis739.catpics.pictures

import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.util.*
import org.koin.ktor.ext.inject
import java.io.ByteArrayInputStream
import java.net.URLConnection

fun Application.pictureRoutes() {
    val pictureRepository by inject<HavePictures>()

    routing {
        get("/api/pictures") {
            val pageNumber: Int? by call.request.queryParameters
            val pageSize: Int? by call.request.queryParameters

            val pictures = pageNumber
                ?.let { number -> pageSize?.let { size -> pictureRepository.findAll(number, size) } }
                ?: pictureRepository.findAll()

            call.respond(pictures.map { it.toPictureResponse() })
        }

        get("/api/pictures/{id}/file") {
            val id: Long by call.parameters
            val picture = pictureRepository.findById(id)
            picture?.apply {
                file.let(::ByteArrayInputStream).use { inputStream ->
                    val contentType = URLConnection.guessContentTypeFromStream(inputStream).split("/")
                    call.respondOutputStream(contentType = ContentType(contentType[0], contentType[1])) {
                        inputStream.copyTo(this)
                    }
                }
            }
        }

        post("/api/pictures") {
            val files = call.receiveMultipart()
            val part = files.readPart() as? PartData.FileItem ?: return@post

            val fileName = part.originalFileName ?: return@post
            val picture = Picture(
                file = part.streamProvider().use { it.readAllBytes() },
                fileName = fileName,
            )

            call.respond(pictureRepository.save(picture).toPictureResponse())
        }
    }
}