package info.davidvedvick.seis739.catpics.security

import kotlinx.serialization.Serializable

@Serializable
data class UserLoginRequest(
    var email: String = "",
    var password: String = "",
)
