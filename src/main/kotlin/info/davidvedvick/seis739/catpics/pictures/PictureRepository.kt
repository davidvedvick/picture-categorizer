package info.davidvedvick.seis739.catpics.pictures

import com.github.jasync.sql.db.SuspendingConnection
import info.davidvedvick.seis739.catpics.toEntity
import kotlin.reflect.KMutableProperty
import kotlin.reflect.full.memberProperties

private val mutableProperties by lazy { Picture::class.memberProperties.filterIsInstance<KMutableProperty<*>>() }

private const val selectFromPictures =
"""
SELECT
     id as id,
     cat_employee_id as catEmployeeId,
     file_name as fileName
FROM picture
"""

class PictureRepository(private val connection: SuspendingConnection) : ManagePictures {
    override suspend fun findById(id: Long): Picture? {
        val result = connection.sendPreparedStatement(
            "$selectFromPictures WHERE id = ?",
            listOf(id)
        )

        return result.rows.firstOrNull()?.toEntity()
    }

    override suspend fun findByCatEmployeeIdAndFileName(catEmployeeId: Long, fileName: String): Picture? {
        val result = connection.sendPreparedStatement(
            """$selectFromPictures 
                |WHERE cat_employee_id = ?
                |AND file_name = ?""".trimMargin(),
            listOf(catEmployeeId, fileName)
        )

        return result.rows.firstOrNull()?.toEntity()
    }

    override suspend fun findAll(pageNumber: Int, pageSize: Int): List<Picture> {
        val result = connection.sendPreparedStatement(
            "$selectFromPictures ORDER BY id DESC LIMIT ?,?",
            listOf(pageNumber * pageSize - 1, pageSize)
        )

        return result.rows.map { row -> row.toEntity() }
    }

    override suspend fun findAll(): List<Picture> {
        val result = connection.sendQuery(selectFromPictures)
        return result.rows.map { row -> row.toEntity() }
    }

    override suspend fun save(picture: Picture): Picture {
        val result = connection.sendPreparedStatement("""
            INSERT INTO picture (cat_employee_id, file_name, file)
            VALUES (?, ?, ?);
            SELECT LAST_INSERT_ID() as id;
        """.trimIndent(),
            listOf(picture.catEmployee?.id, picture.fileName, picture.file)
        )

        picture.id = result.rows.first().getLong(0) ?: 0

        return picture
    }
}