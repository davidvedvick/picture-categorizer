package info.davidvedvick.seis739.catpics.users

import info.davidvedvick.seis739.catpics.security.AuthenticatedCatEmployee
import info.davidvedvick.seis739.catpics.security.UnauthenticatedCatEmployee
import info.davidvedvick.seis739.catpics.security.UserAuthenticationManager
import io.mockk.coEvery
import io.mockk.every
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import org.amshove.kluent.`should be equal to`
import org.amshove.kluent.`should not be`
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.springframework.security.authentication.DisabledException

class `given a new user` {
    class `when logging the user in` {
        private val services by lazy {
            UserAuthenticationManager(
                mockk {
                    coEvery { findByEmail(any()) } returns null

                    coEvery { save(any()) } answers {
                        addedCatEmployee = firstArg()
                        firstArg()
                    }
                },
                mockk {
                    every { encode("SOyRfcI") } returns "eOLdjk"
                    every { matches("SOyRfcI", "eOLdjk") } returns true
                },
            )
        }
        private var addedCatEmployee: CatEmployee? = null

        private lateinit var exception: DisabledException

        @BeforeAll
        fun act() {
            runBlocking {
                try {
                    services.authenticate(UnauthenticatedCatEmployee("4Z00cpZ", "SOyRfcI")) as? AuthenticatedCatEmployee
                } catch (e: DisabledException) {
                    exception = e
                }
            }
        }

        @Test
        fun `then the email is correct`() {
            addedCatEmployee?.email `should be equal to` "4Z00cpZ"
        }

        @Test
        fun `then the password is correct`() {
            addedCatEmployee?.password `should be equal to` "eOLdjk"
        }

        @Test
        fun `then the user is not authenticated`() {
            exception `should not be` null
        }
    }
}