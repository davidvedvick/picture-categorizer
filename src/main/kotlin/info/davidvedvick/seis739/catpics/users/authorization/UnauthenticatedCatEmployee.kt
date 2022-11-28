package info.davidvedvick.seis739.catpics.users.authorization

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken

class UnauthenticatedCatEmployee(email: String, password: String)
    : UsernamePasswordAuthenticationToken(email, password)