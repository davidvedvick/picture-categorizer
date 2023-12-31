import PictureFile from "./PictureFile.js";
import Jimp from "jimp";
import { ServePictureFiles, ServeResizedPictureFiles } from "./ServePictureFiles.js";

export class ResizingPictureFileService implements ServeResizedPictureFiles {
    constructor(private readonly inner: ServePictureFiles) {}

    async getPictureFile(id: number): Promise<PictureFile | null> {
        const pictureFile = await this.inner.getPictureFile(id);

        if (!pictureFile) return null;

        const image = await Jimp.read(Buffer.from(pictureFile.file.buffer));

        const resizedImage =
            image.getWidth() > image.getHeight() ? image.resize(400, Jimp.AUTO) : image.resize(Jimp.AUTO, 400);

        const resizedImageBuffer = await resizedImage.getBufferAsync(pictureFile.mimeType);

        return {
            file: resizedImageBuffer,
            fileName: pictureFile.fileName,
            mimeType: pictureFile.mimeType,
        };
    }
}
