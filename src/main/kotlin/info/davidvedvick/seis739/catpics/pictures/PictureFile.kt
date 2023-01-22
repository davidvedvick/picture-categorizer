package info.davidvedvick.seis739.catpics.pictures

data class PictureFile(val fileName: String, val file: ByteArray) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as PictureFile

        if (fileName != other.fileName) return false

        return true
    }

    override fun hashCode(): Int {
        return fileName.hashCode()
    }
}
