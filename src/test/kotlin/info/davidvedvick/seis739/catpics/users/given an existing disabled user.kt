package info.davidvedvick.seis739.catpics.users

import info.davidvedvick.seis739.catpics.security.UnauthenticatedCatEmployee
import info.davidvedvick.seis739.catpics.security.UserAuthenticationManager
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import org.amshove.kluent.`should not be`
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.springframework.security.authentication.DisabledException

class `given an existing disabled user` {
    class `when logging the user in` {
        private val services by lazy {
            UserAuthenticationManager(
                mockk {
                    coEvery { findByEmail("ZtyPVt") } returns CatEmployee(315, "ZtyPVt", "T1B")
                },
                mockk(),
            )
        }

        private lateinit var exception: DisabledException

        @BeforeAll
        fun act() {
            runBlocking {
                try {
                    services.authenticate(UnauthenticatedCatEmployee("ZtyPVt", "MnI875"))
                } catch (e: DisabledException) {
                    exception = e
                }
            }
        }

        @Test
        fun `then the user is not authenticated`() {
            exception `should not be` null
        }
    }
}