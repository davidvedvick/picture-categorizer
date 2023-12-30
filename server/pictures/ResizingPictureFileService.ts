import PictureFile from "./PictureFile.js";
import { ServePictureFiles, ServeResizedPictureFiles } from "./ServePictureFiles.js";
import sharp, { ResizeOptions } from "sharp";

export class ResizingPictureFileService implements ServeResizedPictureFiles {
    constructor(private readonly inner: ServePictureFiles) {}

    async getPictureFile(id: number): Promise<PictureFile | null> {
        const pictureFile = await this.inner.getPictureFile(id);

        if (!pictureFile) return null;

        const image = sharp(pictureFile.file);

        const metadata = await image.metadata();

        const resizeOptions: ResizeOptions = { fit: "inside" };

        const resizedImage =
            !metadata.width || !metadata.height || metadata.width > metadata.height
                ? image.resize(400, null, resizeOptions)
                : image.resize(null, 400, resizeOptions);

        const resizedImageBuffer = await resizedImage.toBuffer();

        return {
            file: resizedImageBuffer,
            fileName: pictureFile.fileName,
            mimeType: pictureFile.mimeType,
        };
    }
}
