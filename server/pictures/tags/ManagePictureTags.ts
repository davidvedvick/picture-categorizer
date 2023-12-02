import {PictureTag} from "./PictureTag.js";

export interface ManagePictureTags {
    addTag(pictureId: number, tag: string): Promise<PictureTag>

    getPictureTags(pictureId: number): Promise<PictureTag[]>
}