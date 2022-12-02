package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.users.User
import info.davidvedvick.seis739.catpics.users.authorization.AuthenticatedCatEmployee
import io.mockk.every
import io.mockk.mockk
import org.amshove.kluent.`should be equal to`
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.springframework.mock.web.MockMultipartFile

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
            )
        }

        private var addedPictures = ArrayList<Picture>()

        @BeforeAll
        fun act() {
            services.addPicture(
                MockMultipartFile("KEDSlros", byteArrayOf(247.toByte(), 761.toByte(), 879.toByte(), 11.toByte())),
                Picture(
                    id = 314,
                    fileName = "vbzzOT",
                    user = User(id = 920, email = "8N8k", password = "OaH1Su"),
                ),
                AuthenticatedCatEmployee("8N8k", "OaH1Su"),
            )
        }

        @Test fun `then the picture is added`() {
            addedPictures `should be equal to` listOf(
                Picture(
                    id = 314,
                ),
            )
        }

        @Test fun `then the picture has the correct user`() {
            addedPictures.map { it.user } `should be equal to` listOf(
                User(id = 920),
            )
        }

        @Test fun `then the picture has the correct path`() {
            addedPictures.map { it.fileName } `should be equal to` listOf("KEDSlros")
        }

        @Test fun `then the picture bytes are correct`() {
            addedPictures.single().file `should be equal to` byteArrayOf(247.toByte(), 761.toByte(), 879.toByte(), 11.toByte())
        }
    }
}