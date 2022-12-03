package info.davidvedvick.seis739.catpics.pictures

import org.springframework.data.jpa.repository.JpaRepository

interface PictureRepository : JpaRepository<Picture, Long> {
    fun findByUserIdAndFileName(userId: Long, fileName: String): Picture?

    fun findByUserId(id: Long): List<Picture>
}