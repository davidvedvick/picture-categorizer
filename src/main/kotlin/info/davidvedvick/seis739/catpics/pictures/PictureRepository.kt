package info.davidvedvick.seis739.catpics.pictures

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.PagingAndSortingRepository

interface PictureRepository : JpaRepository<Picture, Long>, PagingAndSortingRepository<Picture, Long> {
    fun findByCatEmployeeIdAndFileName(catEmployeeId: Long, fileName: String): Picture?

}