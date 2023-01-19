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
import org.springframework.security.core.AuthenticationException
import java.io.ByteArrayInputStream
import java.net.URLConnection
import kotlin.time.Duration.Companion.days

fun Application.pictureRoutes() {
    val pictureService by inject<ServePictures>()
    val pictureRepository by inject<ManagePictures>()

    routing {
        get("/api/pictures") {
            val pageNumber = call.request.queryParameters["page"]?.toIntOrNull()
            val pageSize = call.request.queryParameters["size"]?.toIntOrNull()

            call.respond(pictureService.getPictures(pageNumber, pageSize))
        }

        get("/api/pictures/{id}/file") {
            val id: Long by call.parameters
            pictureRepository.findFileById(id)?.let(::ByteArrayInputStream)?.use { inputStream ->
                val contentType = URLConnection.guessContentTypeFromStream(inputStream).split("/")
                call.caching = CachingOptions(CacheControl.MaxAge(30.days.inWholeSeconds.toInt()))
                call.respondOutputStream(contentType = ContentType(contentType[0], contentType[1])) {
                    inputStream.copyTo(this)
                }
            }
        }

        authenticate {
            post("/api/pictures") {
                val part = call.receiveMultipart().readPart() as? PartData.FileItem
                val fileName = part?.originalFileName
                val user = call.principal<AuthenticatedCatEmployee>()
                when {
                    part == null -> call.respond(HttpStatusCode.BadRequest)
                    fileName == null -> call.respond(HttpStatusCode.BadRequest)
                    user == null -> call.respond(HttpStatusCode.Unauthorized)
                    else -> {
                        val pictureFile = PictureFile(
                            fileName,
                            part.streamProvider().use { it.readAllBytes() }
                        )
                        try {
                            val picture = pictureService.addPicture(pictureFile, user)
                            call.respond(HttpStatusCode.Accepted, picture)
                        } catch (pictureAlreadyExists: PictureAlreadyExistsException) {
                            call.respond(HttpStatusCode.Conflict)
                        } catch (authenticationException: AuthenticationException) {
                            call.respond(HttpStatusCode.Unauthorized)
                        }
                    }
                }
            }
        }
    }
}