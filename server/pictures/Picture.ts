import * as buffer from "buffer";

export interface Picture {
    id: number,
    fileName: string,
    userId: number,
    file: buffer.Blob
}