package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.Page
import info.davidvedvick.seis739.catpics.security.AuthenticatedCatEmployee
import info.davidvedvick.seis739.catpics.users.ManageCatEmployees
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
    val employeeRepository by inject<ManageCatEmployees>()

    routing {
        get("/api/pictures") {
            val pageNumber = call.request.queryParameters["pageNumber"]?.toIntOrNull()
            val pageSize = call.request.queryParameters["pageSize"]?.toIntOrNull()

            pageNumber
                ?.let { number -> pageSize?.let { size -> pictureRepository.findAll(number, size) } }
                ?.also { pictures ->
                    call.respond(
                        Page(
                            pictures.map { it.toPictureResponse() },
                            false,
                        )
                    )
                }
                ?: call.respond(pictureRepository.findAll().map { it.toPictureResponse() })
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
                val fileName = part?.originalFileName
                val user = call.principal<AuthenticatedCatEmployee>()
                when {
                    part == null -> call.respond(HttpStatusCode.BadRequest)
                    fileName == null -> call.respond(HttpStatusCode.BadRequest)
                    user == null -> call.respond(HttpStatusCode.Unauthorized)
                    else -> {
                        val employee = employeeRepository.findByEmail(user.email)
                        if (employee == null) call.respond(HttpStatusCode.Unauthorized)
                        else {
                            val picture = Picture(
                                file = part.streamProvider().use { it.readAllBytes() },
                                fileName = fileName,
                                catEmployeeId = employee.id
                            )

                            call.respond(pictureRepository.save(picture).toPictureResponse())
                        }
                    }
                }
            }
        }
    }
}