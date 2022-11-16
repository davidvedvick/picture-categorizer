package info.davidvedvick.seis739.catpics.users

import org.hibernate.Hibernate
import javax.persistence.*

@Entity
class User(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var Id: Long = -1,
    @Column(length = 50) var userName: String = "",
    @Column(length = 128) var password: String = "",
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as User

        return Id == other.Id
    }

    override fun hashCode(): Int = javaClass.hashCode()

    @Override
    override fun toString(): String {
        return this::class.simpleName + "(Id = $Id , userName = $userName , password = $password )"
    }
}
