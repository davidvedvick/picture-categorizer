export interface Picture {
    id: number;
    fileName: string;
    catEmployeeId: number;
    file: Buffer;
    mimeType: string;
}
