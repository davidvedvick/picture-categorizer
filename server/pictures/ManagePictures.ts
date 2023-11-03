import {Picture} from "./Picture.js";

export interface ManagePictures {
    findById(id: number): Promise<Picture | null>

    findFileById(id: number): Promise<Uint8Array>

    findByCatEmployeeIdAndFileName(catEmployeeId: number, fileName: String): Promise<Picture | null>

    findAll(pageNumber: number, pageSize: number): Promise<Picture[]>

    findAll(): Promise<Picture[]>

    countAll(): Promise<number>

    save(picture: Picture): Promise<Picture>
}