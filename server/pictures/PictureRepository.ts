import {ManagePictures} from "./ManagePictures.js";
import {Picture} from "./Picture.js";

export class PictureRepository implements ManagePictures {
    countAll(): Promise<number> {
        return 0;
    }

    findAll(pageNumber: Number, pageSize: Number): Promise<Picture[]>;

    findAll(): Promise<Picture[]>;
    findAll(pageNumber?: number, pageSize?: number): Promise<Picture[]> {
        return Promise.resolve([]);
    }

    findByCatEmployeeIdAndFileName(catEmployeeId: number, fileName: String): Promise<Picture | null> {
        return Promise.resolve(null);
    }

    findById(id: number): Promise<Picture | null> {
        return Promise.resolve(null);
    }

    findFileById(id: number): Promise<Blob> {
        return Promise.resolve(new Blob());
    }

    save(picture: Picture): Promise<Picture> {
        return Promise.resolve(picture);
    }
}