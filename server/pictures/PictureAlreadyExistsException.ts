import CatEmployee from "../users/CatEmployee.js";
import PictureFile from "./PictureFile.js";

export class PictureAlreadyExistsException extends Error {
    constructor(pictureFile: PictureFile, catEmployee: CatEmployee) {
        super(`Picture "${pictureFile.fileName}" already exists for user \`${catEmployee.id}\`.`);
    }
}