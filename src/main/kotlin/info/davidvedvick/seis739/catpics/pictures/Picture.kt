package info.davidvedvick.seis739.catpics.pictures

import org.hibernate.Hibernate

class Picture(
    var id: Long = 0,
    var fileName: String = "",
    var file: ByteArray = ByteArray(0),
    var catEmployeeId: Long = 0,
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
        return this::class.simpleName + "(id = $id , path = $fileName )"
    }
}
