package info.davidvedvick.seis739.catpics.users

import info.davidvedvick.seis739.catpics.pictures.Picture
import org.hibernate.Hibernate
import javax.persistence.*

@Entity
class User(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Long = -1,
    @Column(length = 120, unique = true) var email: String = "",
    @Column(length = 128) var password: String = "",
    var isEnabled: Boolean = false,
    @OneToMany(fetch = FetchType.LAZY) @JoinColumn(name = "user_id") var pictures: List<Picture> = emptyList(),
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as User

        return id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()

    @Override
    override fun toString(): String {
        return this::class.simpleName + "(Id = $id , email = $email , password = $password )"
    }
}
