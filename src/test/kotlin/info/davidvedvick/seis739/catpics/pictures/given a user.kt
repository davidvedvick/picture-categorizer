package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.security.AuthenticatedCatEmployee
import info.davidvedvick.seis739.catpics.users.CatEmployee
import io.mockk.every
import io.mockk.mockk
import org.amshove.kluent.`should be`
import org.amshove.kluent.`should be equal to`
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
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

                    every { findByCatEmployeeIdAndFileName(any(), any()) } returns null
                },
                mockk {
                    every { findByEmail("8N8k") } returns CatEmployee(id = 920, password = "OaH1Su")
                }
            )
        }

        private lateinit var response: ResponseEntity<PictureResponse?>
        private var addedPictures = ArrayList<Picture>()

        @BeforeAll
        fun act() {
            response = services.addPictures(
                MockMultipartFile("file", "KEDSlros", null, byteArrayOf(247.toByte(), 761.toByte(), 879.toByte(), 11.toByte())),
                AuthenticatedCatEmployee("8N8k", "OaH1Su"),
            )
        }

        @Test
        fun `then response is correct`() {
            response.statusCode `should be` HttpStatus.ACCEPTED
        }

        @Test fun `then the pictures have the correct user`() {
            addedPictures.map { it.catEmployee }.distinctBy { it?.id } `should be equal to` listOf(
                CatEmployee(id = 920),
            )
        }

        @Test fun `then the picture has the correct path`() {
            addedPictures.map { it.fileName } `should be equal to` listOf("KEDSlros")
        }

        @Test fun `then the picture bytes are correct`() {
            addedPictures.flatMap { it.file.toList() } `should be equal to` listOf(
                247.toByte(), 761.toByte(), 879.toByte(), 11.toByte(),
            )
        }

        @Test fun `then the response data is correct`() {
            response.body?.fileName `should be equal to` addedPictures.first().fileName
        }
    }

    class `and the user has pictures` {
        class `when adding the same pictures` {
            private val services by lazy {
                PictureController(
                    mockk {
                        every { save(any()) } answers {
                            addedPictures.add(firstArg())
                            firstArg()
                        }

                        every { findByCatEmployeeIdAndFileName(920, "gzF0") } returns Picture(fileName = "gzF0")
                    },
                    mockk {
                        every { findByEmail("8N8k") } returns CatEmployee(id = 920, password = "OaH1Su")
                    }
                )
            }

            private lateinit var response: ResponseEntity<PictureResponse?>
            private var addedPictures = ArrayList<Picture>()

            @BeforeAll
            fun act() {
                response = services.addPictures(
                    MockMultipartFile(
                        "file",
                        "gzF0",
                        null,
                        byteArrayOf(247.toByte(), 761.toByte(), 879.toByte(), 11.toByte())
                    ),
                    AuthenticatedCatEmployee("8N8k", "OaH1Su"),
                )
            }

            @Test
            fun `then response is correct`() {
                response.statusCode `should be` HttpStatus.CONFLICT
            }

            @Test
            fun `then the response data is null`() {
                response.body `should be` null
            }

            @Test
            fun `then the picture is not added`() {
                addedPictures `should be equal to` emptyList()
            }
        }
    }
}