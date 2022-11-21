package info.davidvedvick.seis739.catpics.users

import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface UserRepository : JpaRepository<User, Long> {
    fun findByUserName(userName: String): Optional<User>
}