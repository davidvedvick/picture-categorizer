package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.users.User
import io.mockk.every
import io.mockk.mockk
import org.amshove.kluent.`should be equal to`
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import java.util.*

class `given a user` {
    class `when adding the users pictures` {
        private val services by lazy {
            PictureController(
                mockk {
                    every { save(any()) } answers {
                        addedPictures.add(firstArg())
                        firstArg()
                    }
                },
                mockk {
                    every { findByEmail("8N8k") } returns Optional.of(User(id = 920, email = "8N8k", password = "OaH1Su"))
                },
            )
        }

        private var addedPictures = ArrayList<Picture>()

        @BeforeAll
        fun act() {
            services.addPicture(
                Picture(
                    path = "vbzzOT",
                    user = User(id = 920),
                )
            )
        }

        @Test fun `then the picture is added`() {
            addedPictures `should be equal to` listOf(
                Picture(
                    path = "vbzzOT",
                    user = User(id = 920),
                ),
            )
        }
    }
}