package info.davidvedvick.seis739.catpics.pictures

import com.github.jasync.sql.db.SuspendingConnection
import com.github.jasync.sql.db.mysql.MySQLQueryResult
import info.davidvedvick.seis739.catpics.entityFactory
import info.davidvedvick.seis739.catpics.toEntities

private const val selectFromPictures =
"""
SELECT
     id as id,
     cat_employee_id as catEmployeeId,
     file_name as fileName
FROM picture
"""

private val pictureFactory by lazy { entityFactory<Picture>() }

class PictureRepository(private val connection: SuspendingConnection) : ManagePictures {

    override suspend fun findById(id: Long): Picture? {
        val results = connection.sendPreparedStatement(
            "$selectFromPictures WHERE id = ?",
            listOf(id)
        )

        return pictureFactory.toEntities(results).firstOrNull()
    }

    override suspend fun findFileById(id: Long): ByteArray? {
        val results = connection.sendPreparedStatement(
            "SELECT file FROM picture WHERE id = ?",
            listOf(id)
        )

        return results.rows.map { it[0] as? ByteArray }.firstOrNull()
    }

    override suspend fun findByCatEmployeeIdAndFileName(catEmployeeId: Long, fileName: String): Picture? {
        val results = connection.sendPreparedStatement(
            """$selectFromPictures 
                |WHERE cat_employee_id = ?
                |AND file_name = ?""".trimMargin(),
            listOf(catEmployeeId, fileName)
        )

        return pictureFactory.toEntities(results).firstOrNull()
    }

    override suspend fun findAll(pageNumber: Int, pageSize: Int): List<Picture> {
        val result = connection.sendPreparedStatement(
            "$selectFromPictures ORDER BY id DESC LIMIT ?,?",
            listOf(pageNumber * pageSize, pageSize)
        )

        return pictureFactory.toEntities(result)
    }

    override suspend fun findAll(): List<Picture> {
        val result = connection.sendQuery(selectFromPictures)
        return pictureFactory.toEntities(result)
    }

    override suspend fun countAll(): Int {
        val result = connection.sendQuery("SELECT COUNT(*) FROM picture")
        return result.rows.first().getLong(0)?.toInt() ?: -1
    }

    override suspend fun save(picture: Picture): Picture {
        val result = connection.sendPreparedStatement("""
            INSERT INTO picture (cat_employee_id, file_name, file)
            VALUES (?, ?, ?);
        """.trimIndent(),
            listOf(picture.catEmployeeId, picture.fileName, picture.file)
        ) as? MySQLQueryResult

        picture.id = result?.lastInsertId ?: 0

        return picture
    }
}