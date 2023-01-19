package info.davidvedvick.seis739.catpics.pictures

interface ManagePictures {

    suspend fun findById(id: Long): Picture?

    suspend fun findFileById(id: Long): ByteArray?

    suspend fun findAll(pageNumber: Int, pageSize: Int): List<Picture>

    suspend fun findAll(): List<Picture>

    suspend fun countAll(): Int

    suspend fun save(picture: Picture): Picture
}