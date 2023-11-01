import {Picture} from "./Picture.js";
import {Blob} from "buffer";

export interface ManagePictures {
    findById(id: number): Promise<Picture | null>

    findFileById(id: number): Promise<Blob>

    findByCatEmployeeIdAndFileName(catEmployeeId: number, fileName: String): Promise<Picture | null>

    findAll(pageNumber: number, pageSize: number): Promise<Picture[]>

    findAll(): Promise<Picture[]>

    countAll(): Promise<number>

    save(picture: Picture): Promise<Picture>
}