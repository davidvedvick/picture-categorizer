package info.davidvedvick.seis739.catpics.pictures

import info.davidvedvick.seis739.catpics.users.CatEmployee
import java.io.IOException

class PictureAlreadyExistsException(pictureFile: PictureFile, catEmployee: CatEmployee)
    : IOException("""Picture "${pictureFile.fileName}" already exists for user `${catEmployee.id}`.""")