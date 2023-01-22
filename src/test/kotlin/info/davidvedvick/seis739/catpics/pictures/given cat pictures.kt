package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.Page
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import org.amshove.kluent.`should be`
import org.amshove.kluent.`should be equal to`
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test

class `given cat pictures` {

    @Nested
    inner class `when getting the first page` {
        private val services by lazy {
            PictureService(
                mockk {
                    coEvery { findAll(0, 5) } returns listOf(Picture(), Picture())
                    coEvery { countAll() } returns 10
                },
                mockk()
            )
        }

        private lateinit var page: Page<PictureResponse>

        @BeforeAll
        fun act() {
            runBlocking {
                page = services.getPictures(0, 5)
            }
        }

        @Test
        fun `then the returned pictures are correct`() {
            page.content.size `should be equal to` 2
        }

        @Test
        fun `then it is not the last page`() {
            page.isLast `should be` false
        }
    }

    @Nested
    inner class `when getting the last page` {
        private val services by lazy {
            PictureService(
                mockk {
                    coEvery { findAll(1, 3) } returns listOf(Picture())
                    coEvery { countAll() } returns 6
                },
                mockk()
            )
        }

        private lateinit var page: Page<PictureResponse>

        @BeforeAll
        fun act() {
            runBlocking {
                page = services.getPictures(1, 3)
            }
        }

        @Test
        fun `then the returned pictures are correct`() {
            page.content.size `should be equal to` 1
        }

        @Test
        fun `then it is the last page`() {
            page.isLast `should be` true
        }
    }
}