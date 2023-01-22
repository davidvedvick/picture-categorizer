package info.davidvedvick.seis739.catpics.security

import kotlinx.serialization.Serializable

@Serializable
data class JwtToken(val token: String = "", val expiresInMs: Int)