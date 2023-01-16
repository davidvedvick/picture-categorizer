package info.davidvedvick.seis739.catpics.security

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder

class PasswordEncodingConfiguration {

    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()
}