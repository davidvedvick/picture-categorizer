package info.davidvedvick.seis739.catpics.users

import com.github.jasync.sql.db.SuspendingConnection
import info.davidvedvick.seis739.catpics.entityFactory
import info.davidvedvick.seis739.catpics.toEntities

private const val selectFromCatEmployees =
    """
SELECT
     id as id,
     email as email,
     password as password,
     is_enabled as isEnabled
FROM cat_employee
"""

private val employeeFactory by lazy { entityFactory<CatEmployee>() }

class CatEmployeeRepository(private val connection: SuspendingConnection) : ManageCatEmployees {
    override suspend fun findByEmail(email: String): CatEmployee? {
        val results = connection.sendPreparedStatement(
            "$selectFromCatEmployees WHERE email = ?",
            listOf(email)
        )

        return employeeFactory.toEntities(results).firstOrNull()
    }

    override suspend fun save(catEmployee: CatEmployee): CatEmployee {
        val result = connection.sendPreparedStatement("""
            INSERT INTO cat_employee (email, password, is_enabled)
            VALUES (?, ?, ?);
        """.trimIndent(),
            listOf(catEmployee.email, catEmployee.password, catEmployee.isEnabled)
        )

        val lastInsertedId = connection.sendQuery("SELECT LAST_INSERT_ID() as id")

        catEmployee.id = lastInsertedId.rows.first().getLong(0) ?: 0

        return catEmployee
    }
}