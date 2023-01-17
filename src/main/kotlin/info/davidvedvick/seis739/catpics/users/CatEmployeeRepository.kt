package info.davidvedvick.seis739.catpics.users

import com.github.jasync.sql.db.SuspendingConnection
import info.davidvedvick.seis739.catpics.toEntity

private const val selectFromCatEmployees =
    """
SELECT
     id as id,
     email as email,
     password as password,
     is_enabled as isEnabled
FROM cat_employee
"""

class CatEmployeeRepository(private val connection: SuspendingConnection) : ManageCatEmployees {
    override suspend fun findByEmail(email: String): CatEmployee? {
        val result = connection.sendPreparedStatement(
            "$selectFromCatEmployees WHERE email = ?",
            listOf(email)
        )

        return result.rows.firstOrNull()?.toEntity()
    }

    override suspend fun save(catEmployee: CatEmployee): CatEmployee {
        val result = connection.sendPreparedStatement("""
            INSERT INTO cat_employee (email, password, is_enabled)
            VALUES (?, ?, ?);
        """.trimIndent(),
            listOf(catEmployee.email, catEmployee.password, catEmployee.isEnabled)
        )

        val lastInsertedId = connection.sendQuery("SELECT LAST_INSERT_ID() as id");

        catEmployee.id = lastInsertedId.rows.first().getLong(0) ?: 0

        return catEmployee
    }
}