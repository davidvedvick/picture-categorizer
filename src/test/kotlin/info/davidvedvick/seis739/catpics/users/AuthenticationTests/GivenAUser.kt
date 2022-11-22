package info.davidvedvick.seis739.catpics.users.AuthenticationTests

import info.davidvedvick.seis739.catpics.users.User
import info.davidvedvick.seis739.catpics.users.authorization.UserLoginDetails
import info.davidvedvick.seis739.catpics.users.authorization.UserLoginService
import io.mockk.every
import io.mockk.mockk
import org.amshove.kluent.`should be equal to`
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import java.util.*

class GivenAUser {
    class WhenLoadingTheUserLoginDetails {
        private val service by lazy {
            UserLoginService(
                mockk {
                    every { findByUserName("9Fi") } returns Optional.of(User(664, "9Fi", "HQgmsw"))
                }
            )
        }

        private var userLoginDetails: UserLoginDetails? = null

        @BeforeAll
        fun act() {
            userLoginDetails = service.loadUserByUsername("9Fi") as? UserLoginDetails
        }

        @Test
        fun `then the user name is correct`() {
            userLoginDetails?.username `should be equal to` "9Fi"
        }

        @Test
        fun `then the user id is correct`() {
            userLoginDetails?.userId `should be equal to` 664
        }

        @Test
        fun `then the user password is correct`() {
            userLoginDetails?.password `should be equal to` "HQgmsw"
        }
    }
}