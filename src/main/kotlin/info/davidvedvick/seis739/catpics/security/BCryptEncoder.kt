package info.davidvedvick.seis739.catpics.security

import at.favre.lib.crypto.bcrypt.BCrypt

private val version = BCrypt.Version.VERSION_2A
private const val STRENGTH = 10

class BCryptEncoder : Encoder {
    private val bcrypt by lazy { BCrypt.with(version) }
    private val verifier by lazy { BCrypt.verifyer(version) }

    override fun encode(rawPassword: CharArray): String =
        bcrypt.hashToString(STRENGTH, rawPassword)

    override fun matches(rawPassword: CharArray, encodedPassword: String): Boolean =
        verifier.verify(rawPassword, encodedPassword).verified
}