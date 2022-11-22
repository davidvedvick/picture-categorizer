package info.davidvedvick.seis739.catpics

import org.slf4j.Logger
import org.slf4j.LoggerFactory

inline fun <reified T> lazyLogger(): Lazy<Logger> = lazy { LoggerFactory.getLogger(cls<T>()) }