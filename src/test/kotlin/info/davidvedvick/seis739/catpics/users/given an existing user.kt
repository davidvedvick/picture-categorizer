package info.davidvedvick.seis739.catpics.users

import io.mockk.every
import io.mockk.mockk
import org.amshove.kluent.`should be equal to`
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import java.util.*

class `given an existing user` {
    class `when logging the user in` {
        private val services by lazy {
            UserController(
                mockk {
                    every { findByEmail("2l9L") } returns Optional.of(User(822, "2l9L", "zc89"))
                }
            )
        }

        private var user: User? = null

        @BeforeAll
        fun act() {
            user = services.loginUser(User(432, "2l9L", "zc89"))
        }

        @Test
        fun `then the email is correct`() {
            user?.email `should be equal to` "2l9L"
        }

        @Test
        fun `then the password is correct`() {
            user?.password `should be equal to` "zc89"
        }
    }
}