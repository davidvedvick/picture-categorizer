import {ServeTags} from "./ServeTags.js";
import {Tag} from "../../../transfer/index.js";
import {ManagePictureTags} from "./ManagePictureTags.js";

export class TagService implements ServeTags {

    constructor(private readonly pictureTags: ManagePictureTags) {}

    async getTags(pictureId: number): Promise<Tag[]> {
        const pictureTags = await this.pictureTags.getPictureTags(pictureId);
        return pictureTags.map(pt => {
            return {
                tag: pt.tag,
                id: pt.tagId,
            };
        });
    }
}