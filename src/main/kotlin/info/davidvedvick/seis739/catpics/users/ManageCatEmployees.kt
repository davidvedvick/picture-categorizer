package info.davidvedvick.seis739.catpics.users

interface ManageCatEmployees {
    suspend fun findByEmail(email: String): CatEmployee?

    suspend fun save(catEmployee: CatEmployee): CatEmployee
}