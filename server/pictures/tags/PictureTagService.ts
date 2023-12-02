import {ServePictureTags} from "./ServePictureTags.js";
import {PictureTag} from "./PictureTag.js";
import {AuthenticatedCatEmployee} from "../../users/AuthenticatedCatEmployee.js";
import {ManageCatEmployees} from "../../users/ManageCatEmployees.js";
import {ManagePictureTags} from "./ManagePictureTags.js";
import {ManagePictures} from "../ManagePictures.js";

export class PictureTagService implements ServePictureTags {

    constructor(
        private readonly catEmployees: ManageCatEmployees,
        private readonly pictures: ManagePictures,
        private readonly pictureTags: ManagePictureTags) {}

    async addTag(pictureId: number, tag: string, authenticatedUser: AuthenticatedCatEmployee): Promise<PictureTag | null> {
        const picture = await this.pictures.findById(pictureId);

        if (!picture) return null;

        const employee = await this.catEmployees.findByEmail(authenticatedUser.email);

        if (!employee || picture.catEmployeeId != employee.id) return null;

        return await this.pictureTags.addTag(pictureId, tag);
    }
}