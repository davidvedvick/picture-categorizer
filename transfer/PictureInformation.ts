import {Tag} from "./Tag";

export interface PictureInformation {
    id: number;
    fileName: string;
    tags: Tag[];
}