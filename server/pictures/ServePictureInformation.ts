import { PictureInformation } from "../../transfer/index.js";
import { Page } from "../Page.js";
import { PictureFile } from "./PictureFile.js";
import { EmailIdentifiedCatEmployee } from "../users/EmailIdentifiedCatEmployee.js";

export interface ServePictureInformation {
    getPictureInformation(pageNumber: number | null, pageSize: number | null): Promise<Page<PictureInformation>>;

    addPicture(
        pictureFile: PictureFile,
        authenticatedCatEmployee: EmailIdentifiedCatEmployee,
    ): Promise<PictureInformation>;
}
