package info.davidvedvick.seis739.catpics

import kotlinx.serialization.Serializable

@Serializable
class Page<T>(
    val content: List<T>,
    val isLast: Boolean,
)