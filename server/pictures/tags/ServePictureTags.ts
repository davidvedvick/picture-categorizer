import {PictureTag} from "./PictureTag.js";
import {EmailIdentifiedCatEmployee} from "../../users/EmailIdentifiedCatEmployee.js";

export interface ServePictureTags {
    addTag(pictureId: number, tag: string, authenticatedUser: EmailIdentifiedCatEmployee): Promise<PictureTag>
    deleteTag(pictureId: number, tagId: number, authenticatedUser: EmailIdentifiedCatEmployee): Promise<void>
}