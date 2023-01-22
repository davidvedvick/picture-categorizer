package info.davidvedvick.seis739.catpics.security

import at.favre.lib.crypto.bcrypt.BCrypt

private val version = BCrypt.Version.VERSION_2A
private const val STRENGTH = 10

class BCryptEncoder : Encoder {
    private val bcrypt by lazy { BCrypt.with(version) }
    private val verifier by lazy { BCrypt.verifyer(version) }

    override fun encode(rawPassword: String): String =
        bcrypt.hashToString(STRENGTH, rawPassword.toCharArray())

    override fun matches(rawPassword: String, encodedPassword: String): Boolean =
        verifier.verify(rawPassword.toCharArray(), encodedPassword).verified
}