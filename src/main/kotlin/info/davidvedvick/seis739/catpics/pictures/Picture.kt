package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.users.CatEmployee
import org.hibernate.Hibernate
import javax.persistence.*

@Entity
class Picture(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Long = 0,
    @Column(length = 255) var fileName: String = "",
    var file: ByteArray = ByteArray(0),
    @ManyToOne var catEmployee: CatEmployee? = null,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as Picture

        return id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()

    @Override
    override fun toString(): String {
        return this::class.simpleName + "(id = $id , path = $fileName , user = $catEmployee )"
    }
}
