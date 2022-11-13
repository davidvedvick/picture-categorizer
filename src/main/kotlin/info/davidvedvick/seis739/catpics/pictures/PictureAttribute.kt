package info.davidvedvick.seis739.catpics.pictures

import org.hibernate.Hibernate
import javax.persistence.*

@Entity
class PictureAttribute(
    @Id @GeneratedValue var id: Long = 0,
    @Column(length = 50) var name: String = "",
    @Column(length = 100) var value: String = "",
    @ManyToOne var picture: Picture? = null,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as PictureAttribute

        return id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()
}
