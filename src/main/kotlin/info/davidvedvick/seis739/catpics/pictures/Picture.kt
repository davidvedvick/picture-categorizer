package info.davidvedvick.seis739.catpics.pictures

class Picture(
    var id: Long = 0,
    var fileName: String = "",
    var file: ByteArray = ByteArray(0),
    var catEmployeeId: Long = 0,
)