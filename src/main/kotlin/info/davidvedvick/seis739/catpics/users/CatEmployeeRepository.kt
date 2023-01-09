package info.davidvedvick.seis739.catpics.users

import org.springframework.data.jpa.repository.JpaRepository

interface CatEmployeeRepository : JpaRepository<CatEmployee, Long> {
    fun findByEmail(email: String): CatEmployee?
}