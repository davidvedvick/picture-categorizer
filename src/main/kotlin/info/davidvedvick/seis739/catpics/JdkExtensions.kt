package info.davidvedvick.seis739.catpics

import java.util.*

fun <T> Optional<T>.getOrNull(): T? = takeIf { it.isPresent }?.get()