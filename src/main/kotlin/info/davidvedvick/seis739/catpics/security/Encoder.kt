package info.davidvedvick.seis739.catpics.security

interface Encoder {
    fun encode(rawPassword: String): String

    fun matches(rawPassword: String, encodedPassword: String): Boolean
}