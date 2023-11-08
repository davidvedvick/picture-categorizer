import {PictureResponse} from "./PictureResponse.js";
import {Page} from "../Page.js";
import {AuthenticatedCatEmployee} from "../users/AuthenticatedCatEmployee.js";
import PictureFile from "./PictureFile.js";

export interface ServePictures {
    getPictures(pageNumber: number | null, pageSize: number | null): Promise<Page<PictureResponse>>

    addPicture(pictureFile: PictureFile, authenticatedCatEmployee: AuthenticatedCatEmployee): Promise<PictureResponse>
}