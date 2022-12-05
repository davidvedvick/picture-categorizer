package info.davidvedvick.seis739.catpics.security

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken

class UnauthenticatedCatEmployee(val email: String, val password: String)
    : UsernamePasswordAuthenticationToken(email, password)