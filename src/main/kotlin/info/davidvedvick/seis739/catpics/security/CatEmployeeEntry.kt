package info.davidvedvick.seis739.catpics.security

import info.davidvedvick.seis739.catpics.users.CatEmployee
import info.davidvedvick.seis739.catpics.users.ManageCatEmployees

class CatEmployeeEntry(private val manageCatEmployees: ManageCatEmployees, private val passwordEncoder: Encoder) : AuthenticateCatEmployees {

    override suspend fun authenticate(unauthenticatedCatEmployee: UnauthenticatedCatEmployee): CatEmployeeCredentials =
        with (unauthenticatedCatEmployee) {
            val catEmployee = manageCatEmployees.findByEmail(email) ?: manageCatEmployees.save(
                CatEmployee(
                    email = email,
                    password = passwordEncoder.encode(password)
                )
            )

            when {
                !catEmployee.isEnabled -> DisabledCatEmployee(email, password)
                catEmployee.password.isBlank() -> BadCatEmployeeCredentials(email, password)
                passwordEncoder.matches(password, catEmployee.password) -> AuthenticatedCatEmployee(email, password)
                else -> FailedCatEmployeeCredentials(email, password)
            }
        }
}