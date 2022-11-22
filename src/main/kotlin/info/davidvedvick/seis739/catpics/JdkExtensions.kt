package info.davidvedvick.seis739.catpics

import java.util.*

val <T> Optional<T>.value: T?
    get() = takeIf { it.isPresent }?.get()

inline fun <reified T> cls() = T::class.java