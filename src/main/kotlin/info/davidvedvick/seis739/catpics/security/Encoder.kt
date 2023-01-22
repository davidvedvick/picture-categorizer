package info.davidvedvick.seis739.catpics.security

interface Encoder {
    fun encode(rawPassword: CharArray): String

    fun matches(rawPassword: CharArray, encodedPassword: String): Boolean
}