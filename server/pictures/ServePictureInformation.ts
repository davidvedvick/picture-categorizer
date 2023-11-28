import {PictureInformation} from "../../transfer/index.js";
import {Page} from "../Page.js";
import {AuthenticatedCatEmployee} from "../users/AuthenticatedCatEmployee.js";
import PictureFile from "./PictureFile.js";

export interface ServePictureInformation {
    getPictureInformation(pageNumber: number | null, pageSize: number | null): Promise<Page<PictureInformation>>

    addPicture(pictureFile: PictureFile, authenticatedCatEmployee: AuthenticatedCatEmployee): Promise<PictureInformation>
}