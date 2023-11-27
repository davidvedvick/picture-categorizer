import {PictureInformation} from "../../transfer/index.js";
import {Page} from "../Page.js";
import {AuthenticatedCatEmployee} from "../users/AuthenticatedCatEmployee.js";
import PictureFile from "./PictureFile.js";

export interface ServePictures {
    getPictureInformation(pageNumber: number | null, pageSize: number | null): Promise<Page<PictureInformation>>

    getPictureFile(id: number): Promise<PictureFile | null>

    addPicture(pictureFile: PictureFile, authenticatedCatEmployee: AuthenticatedCatEmployee): Promise<PictureInformation>
}