package info.davidvedvick.seis739.catpics.users

import info.davidvedvick.seis739.catpics.security.AuthenticatedCatEmployee
import info.davidvedvick.seis739.catpics.security.CatEmployeeEntry
import info.davidvedvick.seis739.catpics.security.UnauthenticatedCatEmployee
import io.mockk.coEvery
import io.mockk.every
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import org.amshove.kluent.`should be equal to`
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test

class `given an existing user` {
    @Nested
    inner class `when logging the user in` {
        private val services by lazy {
            CatEmployeeEntry(
                mockk {
                    coEvery { findByEmail("2l9L") } returns CatEmployee(822, "2l9L", "MobWbSRg", true)
                },
                mockk {
                    every { encode("zc89") } returns "MobWbSRg"
                    every { matches("zc89", "MobWbSRg") } returns true
                },
            )
        }

        private var user: AuthenticatedCatEmployee? = null

        @BeforeAll
        fun act() {
            runBlocking {
                user = services.authenticate(UnauthenticatedCatEmployee("2l9L", "zc89")) as? AuthenticatedCatEmployee
            }
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