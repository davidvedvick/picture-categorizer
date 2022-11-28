package info.davidvedvick.seis739.catpics.users

import io.mockk.every
import io.mockk.mockk
import org.amshove.kluent.`should be equal to`
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test

class `given a new user` {
    class `when logging the user in` {
        private val services by lazy {
            UserController(
                mockk {
                    every { save(any()) } answers {
                        user = firstArg()
                        firstArg()
                    }
                }
            )
        }

        private var user: User? = null

        @BeforeAll
        fun act() {
            services.loginUser(User(446, "4Z00cpZ", "SOyRfcI"))
        }

        @Test
        fun `then the email is correct`() {
            user?.email `should be equal to` "4Z00cpZ"
        }

        @Test
        fun `then the password is correct`() {
            user?.password `should be equal to` "SOyRfcI"
        }
    }
}