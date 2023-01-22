package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.security.AuthenticatedCatEmployee
import info.davidvedvick.seis739.catpics.users.UnknownCatEmployeeException
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.plugins.cachingheaders.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.util.*
import io.ktor.util.*
import io.ktor.utils.io.jvm.javaio.*
import org.koin.ktor.ext.inject
import kotlin.time.Duration.Companion.days

private val imageCachingOptions = CachingOptions(CacheControl.MaxAge(30.days.inWholeSeconds.toInt()))

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
            pictureRepository.findFileById(id)?.also { bytes ->
                call.caching = imageCachingOptions
                call.respondBytes(bytes)
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
                            part.streamProvider().use { it.toByteReadChannel().toByteArray() }
                        )
                        try {
                            val picture = pictureService.addPicture(pictureFile, user)
                            call.respond(HttpStatusCode.Accepted, picture)
                        } catch (pictureAlreadyExists: PictureAlreadyExistsException) {
                            call.respond(HttpStatusCode.Conflict)
                        } catch (authenticationException: UnknownCatEmployeeException) {
                            call.respond(HttpStatusCode.Unauthorized)
                        }
                    }
                }
            }
        }
    }
}