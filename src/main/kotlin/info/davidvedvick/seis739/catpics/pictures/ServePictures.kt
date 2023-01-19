package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.Page
import info.davidvedvick.seis739.catpics.security.AuthenticatedCatEmployee

interface ServePictures {
    suspend fun getPictures(pageNumber: Int? = null, pageSize: Int? = null): Page<PictureResponse>

    suspend fun addPicture(pictureFile: PictureFile, authenticatedCatEmployee: AuthenticatedCatEmployee): PictureResponse
}