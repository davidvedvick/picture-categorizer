import { Picture } from "./Picture.js";
import { DescribedPicture } from "./DescribedPicture.js";

export interface ManagePictures {
    findById(id: number): Promise<DescribedPicture | null>;

    findFileById(id: number): Promise<Buffer>;

    findByCatEmployeeIdAndFileName(catEmployeeId: number, fileName: string): Promise<DescribedPicture | null>;

    findAll(pageNumber: number | null, pageSize: number | null): Promise<DescribedPicture[]>;

    countAll(): Promise<number>;

    save(picture: Picture): Promise<Picture>;

    setPictureTagId(pictureId: number, descriptionTagId: number): Promise<DescribedPicture | null>;
}
