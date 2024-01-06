import { ResizePictureRequest } from "./ResizePictureRequest.js";
import { ResizedPictureId } from "./ResizedPictureId.js";
import Jimp from "jimp";
import { ManageResizedPictures } from "./ManageResizedPictures.js";
import { ManagePictures } from "../ManagePictures.js";

export interface ProcessPictureResizeRequests {
    promiseResize(message: ResizePictureRequest): Promise<ResizedPictureId | null>;
}

export class ResizePictureProcessor implements ProcessPictureResizeRequests {
    constructor(
        private readonly resizePictureRepository: ManageResizedPictures,
        private readonly pictureRepository: ManagePictures,
    ) {}

    async promiseResize(resizePictureRequest: ResizePictureRequest) {
        let resizedPictureId: ResizedPictureId | null;
        while (!(resizedPictureId = this.resizePictureRepository.findByRequest(resizePictureRequest))) {
            try {
                const pictureId = resizePictureRequest.pictureId;
                const pictureInformation = await this.pictureRepository.findById(pictureId);
                const pictureFile = await this.pictureRepository.findFileById(pictureId);
                if (!pictureFile || !pictureInformation) {
                    return null;
                }

                const image = await Jimp.read(pictureFile);

                const resizedImage =
                    image.getWidth() > image.getHeight()
                        ? image.resize(resizePictureRequest.maxWidth, Jimp.AUTO)
                        : image.resize(Jimp.AUTO, resizePictureRequest.maxHeight);

                const resizedImageBuffer = await resizedImage.getBufferAsync(pictureInformation.mimeType);
                this.resizePictureRepository.save({
                    file: resizedImageBuffer,
                    ...resizePictureRequest,
                });
            } catch (e) {
                console.error(`An error occurred inserting the resized picture request: ${resizePictureRequest}`);
            }
        }

        return resizedPictureId;
    }
}
