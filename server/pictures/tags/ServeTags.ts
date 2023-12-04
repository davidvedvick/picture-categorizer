import {Tag} from "../../../transfer/index.js";

export interface ServeTags {
    getTags(pictureId: number): Promise<Tag[]>
}