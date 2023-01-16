package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.security.AuthenticatedCatEmployee
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.plugins.cachingheaders.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.util.*
import org.koin.ktor.ext.inject
import java.io.ByteArrayInputStream
import java.net.URLConnection
import kotlin.time.Duration.Companion.days

fun Application.pictureRoutes() {
    val pictureRepository by inject<ManagePictures>()

    routing {
        get("/api/pictures") {
            val pageNumber = call.request.queryParameters["pageNumber"]?.toIntOrNull()
            val pageSize = call.request.queryParameters["pageSize"]?.toIntOrNull()

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
                    call.caching = CachingOptions(CacheControl.MaxAge(30.days.inWholeSeconds.toInt()))
                    call.respondOutputStream(contentType = ContentType(contentType[0], contentType[1])) {
                        inputStream.copyTo(this)
                    }
                }
            }
        }

        authenticate {
            post("/api/pictures") {
                val part = call.receiveMultipart().readPart() as? PartData.FileItem
                if (part == null) call.respond(HttpStatusCode.BadRequest)
                else {
                    val fileName = part.originalFileName ?: return@post
                    val user = call.principal<AuthenticatedCatEmployee>()
                    val picture = Picture(
                        file = part.streamProvider().use { it.readAllBytes() },
                        fileName = fileName,
                    )

                    call.respond(pictureRepository.save(picture).toPictureResponse())
                }
            }
        }
    }
}