package info.davidvedvick.seis739.catpics.pictures

fun Picture.toPictureResponse() = PictureResponse(
    id,
    fileName,
    catEmployeeId
)