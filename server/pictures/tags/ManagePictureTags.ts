import { PictureTag } from "./PictureTag.js";

export interface ManagePictureTags {
    getOrAddTag(pictureId: number, tag: string): Promise<PictureTag>;

    deletePictureTag(pictureId: number, tagId: number): Promise<void>;

    getPictureTags(pictureId: number): Promise<PictureTag[]>;
}
