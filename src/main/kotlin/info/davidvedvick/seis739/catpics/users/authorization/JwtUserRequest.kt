package info.davidvedvick.seis739.catpics.users.authorization

data class JwtUserRequest(
    var email: String = "",
    var password: String = "",
)
