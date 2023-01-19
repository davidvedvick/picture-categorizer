package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.Page
import info.davidvedvick.seis739.catpics.security.AuthenticatedCatEmployee
import info.davidvedvick.seis739.catpics.users.ManageCatEmployees
import org.springframework.security.core.userdetails.UsernameNotFoundException

class PictureService(private val pictureRepository: ManagePictures, private val employeeRepository: ManageCatEmployees) : ServePictures {
    override suspend fun getPictures(pageNumber: Int?, pageSize: Int?): Page<PictureResponse> {
        return pageNumber
            ?.let { number ->
                pageSize?.let { size ->
                    Page(
                        pictureRepository.findAll(number, size),
                        pictureRepository.countAll() <= number * size,
                    )
                }
            }
            ?.let { originalPage ->
                Page(
                    originalPage.content.map { it.toPictureResponse() },
                    originalPage.isLast,
                )
            }
            ?: Page(
                pictureRepository.findAll().map { it.toPictureResponse() },
                true,
            )
    }

    override suspend fun addPicture(pictureFile: PictureFile, authenticatedCatEmployee: AuthenticatedCatEmployee): PictureResponse {
        val employee = employeeRepository.findByEmail(authenticatedCatEmployee.email)
            ?: throw UsernameNotFoundException("Not found")

        val picture = Picture(
            file = pictureFile.file,
            fileName = pictureFile.fileName,
            catEmployeeId = employee.id
        )

        return pictureRepository.save(picture).toPictureResponse()
    }
}