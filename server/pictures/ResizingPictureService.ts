import {ServePictures} from "./ServePictures.js";
import PictureFile from "./PictureFile.js";
import {AuthenticatedCatEmployee} from "../users/AuthenticatedCatEmployee.js";
import {PictureInformation} from "../../transfer/index.js";
import {Page} from "../Page.js";
import Jimp from "jimp";

export class ResizingPictureService implements ServePictures {

    constructor(private readonly inner: ServePictures) {}

    addPicture(pictureFile: PictureFile, authenticatedCatEmployee: AuthenticatedCatEmployee): Promise<PictureInformation> {
        return this.inner.addPicture(pictureFile, authenticatedCatEmployee);
    }

    async getPictureFile(id: number): Promise<PictureFile | null> {
        const pictureFile = await this.inner.getPictureFile(id);

        if (!pictureFile) return null;

        const image = await Jimp.read(Buffer.from(pictureFile.file));

        const resizedImage = await image.resize(400, Jimp.AUTO).getBufferAsync(pictureFile.mimeType);

        return {
            file: resizedImage,
            fileName: pictureFile.fileName,
            mimeType: pictureFile.mimeType,
        };
    }

    getPictureInformation(pageNumber: number | null, pageSize: number | null): Promise<Page<PictureInformation>> {
        return this.inner.getPictureInformation(pageNumber, pageSize);
    }

}