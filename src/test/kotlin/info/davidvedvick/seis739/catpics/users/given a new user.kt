package info.davidvedvick.seis739.catpics.users

import info.davidvedvick.seis739.catpics.security.CatEmployeeCredentials
import info.davidvedvick.seis739.catpics.security.CatEmployeeEntry
import info.davidvedvick.seis739.catpics.security.DisabledCatEmployee
import info.davidvedvick.seis739.catpics.security.UnauthenticatedCatEmployee
import io.mockk.coEvery
import io.mockk.every
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import org.amshove.kluent.`should be equal to`
import org.amshove.kluent.`should be instance of`
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test

class `given a new user` {
    @Nested
    inner class `when logging the user in` {
        private val services by lazy {
            CatEmployeeEntry(
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
        private lateinit var catEmployeeCredentials: CatEmployeeCredentials

        @BeforeAll
        fun act() {
            runBlocking {
                catEmployeeCredentials = services.authenticate(UnauthenticatedCatEmployee("4Z00cpZ", "SOyRfcI"))
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
            catEmployeeCredentials `should be instance of` DisabledCatEmployee::class
        }
    }
}