import {PictureResponse} from "./PictureResponse.js";
import {Page} from "../Page.js";
import {AuthenticatedCatEmployee} from "../security/AuthenticatedCatEmployee.js";

export interface ServePictures {
    getPictures(pageNumber: number | null = null, pageSize: number | null = null): Promise<Page<PictureResponse>>

    addPicture(pictureFile: PictureFile, authenticatedCatEmployee: AuthenticatedCatEmployee): Promise<PictureResponse>
}