package info.davidvedvick.seis739.catpics.users.authorization

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority

class AuthenticatedCatEmployee(email: String, password: String)
    : UsernamePasswordAuthenticationToken(email, password, mutableListOf(SimpleGrantedAuthority("simple")))