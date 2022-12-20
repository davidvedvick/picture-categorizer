package info.davidvedvick.seis739.catpics.users

import info.davidvedvick.seis739.catpics.security.AuthenticatedCatEmployee
import info.davidvedvick.seis739.catpics.security.UnauthenticatedCatEmployee
import info.davidvedvick.seis739.catpics.security.UserAuthenticationManager
import io.mockk.every
import io.mockk.mockk
import org.amshove.kluent.`should be`
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test

class `given an existing user without a password` {
    class `when logging the user in` {
        private val services by lazy {
            UserAuthenticationManager(
                mockk {
                    every { findByEmail("ZtyPVt") } returns User(315, "ZtyPVt", "")
                },
                mockk(),
            )
        }

        private var user: AuthenticatedCatEmployee? = null

        @BeforeAll
        fun act() {
            user = services.authenticate(UnauthenticatedCatEmployee("ZtyPVt", "MnI875")) as? AuthenticatedCatEmployee
        }

        @Test
        fun `then the user is not authenticated`() {
            user `should be` null
        }
    }
}