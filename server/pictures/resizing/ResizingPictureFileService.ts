import { PictureFile } from "../PictureFile.js";
import { ServeResizedPictureFiles } from "../ServePictureFiles.js";
import { ResizePictureRequest } from "./ResizePictureRequest.js";
import { ManagePictures } from "../ManagePictures.js";
import { ManageResizedPictures } from "./ManageResizedPictures.js";
import { ProcessPictureResizeRequests } from "./ResizePictureProcessor.js";

export class ResizingPictureFileService implements ServeResizedPictureFiles {
    constructor(
        private readonly resizedPictureRepository: ManageResizedPictures,
        private readonly pictureRepository: ManagePictures,
        private readonly pictureResizeProcessor: ProcessPictureResizeRequests,
    ) {}

    async getPictureFile(id: number): Promise<PictureFile | null> {
        const resizePictureRequest = {
            pictureId: id,
            maxWidth: 400,
            maxHeight: 400,
        } as ResizePictureRequest;

        const picture = await this.pictureRepository.findById(id);
        if (!picture) {
            return null;
        }

        let resizedPictureId = this.resizedPictureRepository.findByRequest(resizePictureRequest);
        if (resizedPictureId) {
            const file = this.resizedPictureRepository.findFileById(resizedPictureId.id);
            return {
                ...picture,
                file: file,
            };
        }

        resizedPictureId = await this.pictureResizeProcessor.promiseResize(resizePictureRequest);
        if (!resizedPictureId) {
            return null;
        }

        const file = this.resizedPictureRepository.findFileById(resizedPictureId.id);
        return {
            ...picture,
            file: file,
        };
    }
}
