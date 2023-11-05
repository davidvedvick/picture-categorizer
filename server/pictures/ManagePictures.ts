import {Picture} from "./Picture.js";

export interface ManagePictures {
    findById(id: number): Promise<Picture | null>

    findFileById(id: number): Promise<Uint8Array>

    findByCatEmployeeIdAndFileName(catEmployeeId: number, fileName: string): Promise<Picture | null>

    findAll(pageNumber: number | null, pageSize: number | null): Promise<Picture[]>

    countAll(): Promise<number>

    save(picture: Picture): Promise<Picture>
}