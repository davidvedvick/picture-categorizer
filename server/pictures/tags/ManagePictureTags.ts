import {PictureTag} from "./PictureTag.js";

export interface ManagePictureTags {
    addTag(pictureId: number, tag: string): Promise<PictureTag>

    deletePictureTag(pictureId: number, tagId: number): Promise<void>

    getPictureTags(pictureId: number): Promise<PictureTag[]>
}