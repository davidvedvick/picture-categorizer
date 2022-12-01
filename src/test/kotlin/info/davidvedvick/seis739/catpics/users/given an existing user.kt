package info.davidvedvick.seis739.catpics.users

import info.davidvedvick.seis739.catpics.users.authorization.AuthenticatedCatEmployee
import info.davidvedvick.seis739.catpics.users.authorization.UnauthenticatedCatEmployee
import info.davidvedvick.seis739.catpics.users.authorization.UserAuthenticationManager
import io.mockk.every
import io.mockk.mockk
import org.amshove.kluent.`should be equal to`
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test

class `given an existing user` {
    class `when logging the user in` {
        private val services by lazy {
            UserAuthenticationManager(
                mockk {
                    every { findByEmail("2l9L") } returns User(822, "2l9L", "MobWbSRg")
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
            user = services.authenticate(UnauthenticatedCatEmployee("2l9L", "zc89")) as? AuthenticatedCatEmployee
        }

        @Test
        fun `then the email is correct`() {
            user?.name `should be equal to` "2l9L"
        }

        @Test
        fun `then the password is correct`() {
            user?.credentials `should be equal to` "MobWbSRg"
        }
    }
}