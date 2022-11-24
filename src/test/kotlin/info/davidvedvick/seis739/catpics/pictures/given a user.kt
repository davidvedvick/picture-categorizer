package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.users.User
import io.mockk.every
import io.mockk.mockk
import org.amshove.kluent.`should be equal to`
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import java.util.*

class `given a user` {
    class `when getting the users pictures` {
        private val services by lazy {
            PictureController(
                mockk {
                    val user = User(id = 920)
                    every { findByUserId(920) } returns listOf(
                        Picture(840, "Iox", user),
                        Picture(736, "yWyIt5ou", user),
                        Picture(35, "Y18", user),
                        Picture(180, "oe0K", user),
                    )
                },
                mockk {
                    every { findByUserName("8N8k") } returns Optional.of(User(id = 920, userName = "8N8k", password = "OaH1Su"))
                },
            )
        }

        private var pictures: List<Picture> = emptyList()

        @BeforeAll
        fun act() {
            pictures = services.getUserPictures(920)
        }

        @Test fun `then the pictures are correct`() {
            pictures `should be equal to` listOf(
                Picture(840, "Iox"),
                Picture(736, "yWyIt5ou"),
                Picture(35, "Y18"),
                Picture(180, "oe0K"),
            )
        }
    }
}