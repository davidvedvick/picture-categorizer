import {PictureTag} from "./PictureTag.js";
import {AuthenticatedCatEmployee} from "../../users/AuthenticatedCatEmployee.js";

export interface ServePictureTags {
    addTag(pictureId: number, tag: string, authenticatedUser: AuthenticatedCatEmployee): Promise<PictureTag>
    deleteTag(pictureId: number, tagId: number, authenticatedUser: AuthenticatedCatEmployee): Promise<void>
}