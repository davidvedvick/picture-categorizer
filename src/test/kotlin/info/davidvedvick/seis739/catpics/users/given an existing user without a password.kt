package info.davidvedvick.seis739.catpics.users

import info.davidvedvick.seis739.catpics.security.BadCatEmployeeCredentials
import info.davidvedvick.seis739.catpics.security.CatEmployeeCredentials
import info.davidvedvick.seis739.catpics.security.CatEmployeeEntry
import info.davidvedvick.seis739.catpics.security.UnauthenticatedCatEmployee
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import org.amshove.kluent.`should be instance of`
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test

class `given an existing user without a password` {
    @Nested
    inner class `when logging the user in` {
        private val services by lazy {
            CatEmployeeEntry(
                mockk {
                    coEvery { findByEmail("ZtyPVt") } returns CatEmployee(315, "ZtyPVt", "", true)
                },
                mockk(),
            )
        }

        private lateinit var catEmployeeCredentials: CatEmployeeCredentials

        @BeforeAll
        fun act() {
            runBlocking {
                catEmployeeCredentials = services.authenticate(UnauthenticatedCatEmployee("ZtyPVt", "MnI875"))
            }
        }

        @Test
        fun `then the user is not authenticated`() {
            catEmployeeCredentials `should be instance of` BadCatEmployeeCredentials::class
        }
    }
}