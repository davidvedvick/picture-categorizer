package info.davidvedvick.seis739.catpics.authentication

import info.davidvedvick.seis739.catpics.security.AuthenticatedCatEmployee
import info.davidvedvick.seis739.catpics.security.AuthenticationConfiguration
import info.davidvedvick.seis739.catpics.security.JwtTokenManagement
import org.amshove.kluent.`should be equal to`
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test

class `given a generated token` {
    @Nested
    inner class `when decoding it` {

        private val services by lazy {
            JwtTokenManagement(AuthenticationConfiguration().apply {
                secret = "dbcaaee6-324c-498a-8c97-11dd2a1b0651"
            })
        }

        private var authenticatedUser: AuthenticatedCatEmployee? = null

        @BeforeAll
        fun act() {
            val token = services.generateToken(AuthenticatedCatEmployee("y8enGif", ""))
            authenticatedUser = services.decodeToken(token.token)
        }

        @Test
        fun `then the user is correct`() {
            authenticatedUser?.email `should be equal to` "y8enGif"
        }
    }
}