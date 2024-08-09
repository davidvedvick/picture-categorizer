import { PictureInformation } from "../../transfer/index.js";
import { Page } from "../Page.js";
import { PictureFile } from "./PictureFile.js";
import { EmailIdentifiedCatEmployee } from "../users/EmailIdentifiedCatEmployee.js";

export interface ServePictureInformation {
    getPictureInformation(pictureId: number): Promise<PictureInformation | null>;

    getPictureInformationPages(pageNumber: number | null, pageSize: number | null): Promise<Page<PictureInformation>>;

    addPicture(
        pictureFile: PictureFile,
        authenticatedCatEmployee: EmailIdentifiedCatEmployee,
    ): Promise<PictureInformation>;

    deletePicture(pictureId: number, authenticatedUser: EmailIdentifiedCatEmployee): Promise<void>;
}
