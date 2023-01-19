package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.security.AuthenticatedCatEmployee
import info.davidvedvick.seis739.catpics.users.CatEmployee
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import org.amshove.kluent.`should be equal to`
import org.amshove.kluent.`should not be`
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.springframework.security.core.userdetails.UsernameNotFoundException

class `given a user` {
    class `when adding the users pictures` {
        private val services by lazy {
            PictureService(
                mockk {
                    coEvery { save(any()) } answers {
                        addedPictures.add(firstArg())
                        firstArg()
                    }

                    coEvery { findByCatEmployeeIdAndFileName(any(), any()) } returns null
                },
                mockk {
                    coEvery { findByEmail("8N8k") } returns CatEmployee(id = 920, password = "OaH1Su")
                }
            )
        }

        private lateinit var response: PictureResponse
        private var addedPictures = ArrayList<Picture>()

        @BeforeAll
        fun act() {
            runBlocking {
                response = services.addPicture(
                    PictureFile("KEDSlros", byteArrayOf(247.toByte(), 761.toByte(), 879.toByte(), 11.toByte())),
                    AuthenticatedCatEmployee("8N8k", "OaH1Su"),
                )
            }
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
            response.fileName `should be equal to` addedPictures.first().fileName
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

                        coEvery { findByCatEmployeeIdAndFileName(920, "gzF0") } returns Picture(fileName = "gzF0")
                    },
                    mockk {
                        coEvery { findByEmail("8N8k") } returns CatEmployee(id = 920, password = "OaH1Su")
                    }
                )
            }

            private lateinit var exception: PictureAlreadyExistsException
            private var addedPictures = ArrayList<Picture>()

            @BeforeAll
            fun act() {
                runBlocking {
                    try {
                        services.addPicture(
                            PictureFile(
                                "gzF0",
                                byteArrayOf(247.toByte(), 761.toByte(), 879.toByte(), 11.toByte())
                            ),
                            AuthenticatedCatEmployee("8N8k", "OaH1Su"),
                        )
                    } catch (e: PictureAlreadyExistsException) {
                        exception = e
                    }
                }
            }

            @Test
            fun `then an exception is thrown`() {
                exception.message `should be equal to` "Picture \"gzF0\" already exists for user `920`."
            }

            @Test
            fun `then the picture is not added`() {
                addedPictures `should be equal to` emptyList()
            }
        }
    }

    class `and the user doesn't exist` {
        class `when adding pictures` {
            private val services by lazy {
                PictureService(
                    mockk {
                        coEvery { save(any()) } answers {
                            addedPictures.add(firstArg())
                            firstArg()
                        }

                        coEvery { findByCatEmployeeIdAndFileName(any(), any()) } returns null
                    },
                    mockk {
                        coEvery { findByEmail("8N8k") } returns null
                    }
                )
            }

            private lateinit var exception: UsernameNotFoundException
            private val addedPictures = ArrayList<Picture>()

            @BeforeAll
            fun act() {
                runBlocking {
                    try {
                        services.addPicture(
                            PictureFile(
                                "gzF0",
                                byteArrayOf(247.toByte(), 761.toByte(), 879.toByte(), 11.toByte())
                            ),
                            AuthenticatedCatEmployee("8N8k", "OaH1Su"),
                        )
                    } catch (e: UsernameNotFoundException) {
                        exception = e
                    }
                }
            }

            @Test
            fun `then an exception is thrown`() {
                exception `should not be` null
            }

            @Test
            fun `then the picture is not added`() {
                addedPictures `should be equal to` emptyList()
            }
        }
    }
}