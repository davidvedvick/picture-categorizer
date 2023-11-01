import {PictureResponse} from "./PictureResponse.js";
import {Page} from "../Page.js";
import {AuthenticatedCatEmployee} from "../security/AuthenticatedCatEmployee.js";

export interface ServePictures {
    getPictures(pageNumber: Number | null = null, pageSize: Number | null = null): Promise<Page<PictureResponse>>

    addPicture(pictureFile: PictureFile, authenticatedCatEmployee: AuthenticatedCatEmployee): Promise<PictureResponse>
}