import { ResizePictureRequest } from "./ResizePictureRequest.js";
import { ResizedPictureId } from "./ResizedPictureId.js";
import { ResizedPicture } from "./ResizedPicture.js";

export interface ManageResizedPictures {
    findByRequest(resizePictureRequest: ResizePictureRequest): ResizedPictureId | null;

    findById(id: number): ResizedPictureId | null;

    findFileById(id: number): Buffer;

    save(picture: ResizedPicture): ResizedPictureId;
}
