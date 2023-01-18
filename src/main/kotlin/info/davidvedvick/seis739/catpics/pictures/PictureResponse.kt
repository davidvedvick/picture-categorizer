package info.davidvedvick.seis739.catpics.pictures

import kotlinx.serialization.Serializable

@Serializable
data class PictureResponse(
    val id: Long,
    val fileName: String,
    val userId: Long
)