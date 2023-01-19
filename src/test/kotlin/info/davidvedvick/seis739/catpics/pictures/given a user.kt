package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.security.AuthenticatedCatEmployee
import info.davidvedvick.seis739.catpics.users.CatEmployee
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import org.amshove.kluent.`should be`
import org.amshove.kluent.`should be equal to`
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

class `given a user` {
    class `when adding the users pictures` {
        private val services by lazy {
            PictureService(
                mockk {
                    coEvery { save(any()) } answers {
                        addedPictures.add(firstArg())
                        firstArg()
                    }
                },
                mockk {
                    coEvery { findByEmail("8N8k") } returns CatEmployee(id = 920, password = "OaH1Su")
                }
            )
        }

        private lateinit var response: ResponseEntity<PictureResponse?>
        private var addedPictures = ArrayList<Picture>()

        @BeforeAll
        fun act() {
            runBlocking {
                services.addPicture(
                    PictureFile("KEDSlros", byteArrayOf(247.toByte(), 761.toByte(), 879.toByte(), 11.toByte())),
                    AuthenticatedCatEmployee("8N8k", "OaH1Su"),
                )
            }
        }

        @Test
        fun `then response is correct`() {
            response.statusCode `should be` HttpStatus.ACCEPTED
        }

        @Test
        fun `then the pictures have the correct user`() {
            addedPictures.map { it.catEmployeeId }.distinct() `should be equal to` listOf(920)
        }

        @Test
        fun `then the picture has the correct path`() {
            addedPictures.map { it.fileName } `should be equal to` listOf("KEDSlros")
        }

        @Test
        fun `then the picture bytes are correct`() {
            addedPictures.flatMap { it.file.toList() } `should be equal to` listOf(
                247.toByte(), 761.toByte(), 879.toByte(), 11.toByte(),
            )
        }

        @Test
        fun `then the response data is correct`() {
            response.body?.fileName `should be equal to` addedPictures.first().fileName
        }
    }

    class `and the user has pictures` {
        class `when adding the same pictures` {
            private val services by lazy {
                PictureService(
                    mockk {
                        coEvery { save(any()) } answers {
                            addedPictures.add(firstArg())
                            firstArg()
                        }
                    },
                    mockk {
                        coEvery { findByEmail("8N8k") } returns CatEmployee(id = 920, password = "OaH1Su")
                    }
                )
            }

            private lateinit var response: ResponseEntity<PictureResponse?>
            private var addedPictures = ArrayList<Picture>()

            @BeforeAll
            fun act() {
                runBlocking {
                    services.addPicture(
                        PictureFile(
                            "gzF0",
                            byteArrayOf(247.toByte(), 761.toByte(), 879.toByte(), 11.toByte())
                        ),
                        AuthenticatedCatEmployee("8N8k", "OaH1Su"),
                    )
                }
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