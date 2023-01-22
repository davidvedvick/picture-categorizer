package info.davidvedvick.seis739.catpics

import kotlinx.serialization.Serializable

@Serializable
data class Page<T>(
    val content: List<T>,
    val isLast: Boolean,
)