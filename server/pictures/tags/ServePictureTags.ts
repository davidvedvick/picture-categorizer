import {PictureTag} from "./PictureTag.js";
import {AuthenticatedCatEmployee} from "../../users/AuthenticatedCatEmployee.js";

export interface ServePictureTags {
    addTag(pictureId: number, tag: string, authenticatedUser: AuthenticatedCatEmployee): Promise<PictureTag>
}