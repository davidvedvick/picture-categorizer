import PictureFile from "./PictureFile.js";

export interface ServePictureFiles {
    getPictureFile(id: number): Promise<PictureFile | null>
}

export interface ServeResizedPictureFiles extends ServePictureFiles {}