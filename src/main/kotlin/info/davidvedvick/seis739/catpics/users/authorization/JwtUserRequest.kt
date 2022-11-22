package info.davidvedvick.seis739.catpics.users.authorization

data class JwtUserRequest(
    var username: String = "",
    var password: String = "",
)
