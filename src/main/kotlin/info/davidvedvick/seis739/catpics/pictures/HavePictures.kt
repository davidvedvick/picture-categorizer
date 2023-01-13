package info.davidvedvick.seis739.catpics.pictures

interface HavePictures {

    suspend fun findById(id: Long): Picture?
    suspend fun findByCatEmployeeIdAndFileName(catEmployeeId: Long, fileName: String): Picture?

    suspend fun findAll(pageNumber: Int, pageSize: Int): List<Picture>

    suspend fun findAll(): List<Picture>
    suspend fun save(picture: Picture): Picture
}