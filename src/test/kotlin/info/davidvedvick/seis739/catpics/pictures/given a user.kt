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
                    every { saveAll(any<Iterable<Picture>>()) } answers {
                        addedPictures.addAll(firstArg())
                        firstArg()
                    }
                },
                mockk {
                    every { findByEmail("8N8k") } returns User(id = 920, password = "OaH1Su")
                }
            )
        }

        private var addedPictures = ArrayList<Picture>()

        @BeforeAll
        fun act() {
            services.addPictures(
                arrayOf(
                    MockMultipartFile("files", "KEDSlros", null, byteArrayOf(247.toByte(), 761.toByte(), 879.toByte(), 11.toByte())),
                    MockMultipartFile("files", "sight", null, byteArrayOf(661.toByte(), 64.toByte(), 318.toByte(), 590.toByte())),
                ),
                AuthenticatedCatEmployee("8N8k", "OaH1Su"),
            )
        }

        @Test fun `then the pictures have the correct user`() {
            addedPictures.map { it.user }.distinctBy { it?.id } `should be equal to` listOf(
                User(id = 920),
            )
        }

        @Test fun `then the picture has the correct path`() {
            addedPictures.map { it.fileName } `should be equal to` listOf("KEDSlros", "sight")
        }

        @Test fun `then the picture bytes are correct`() {
            addedPictures.flatMap { it.file.toList() } `should be equal to` listOf(
                247.toByte(), 761.toByte(), 879.toByte(), 11.toByte(), 661.toByte(), 64.toByte(), 318.toByte(), 590.toByte()
            )
        }
    }
}