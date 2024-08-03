import { ServePictureTags } from "./ServePictureTags.js";
import { PictureTag } from "./PictureTag.js";
import { ManageCatEmployees } from "../../users/ManageCatEmployees.js";
import { ManagePictureTags } from "./ManagePictureTags.js";
import { ManagePictures } from "../ManagePictures.js";
import { IncorrectEmployeeException } from "../../users/IncorrectEmployeeException.js";
import { PictureNotFoundException } from "../PictureNotFoundException.js";
import { EmailIdentifiedCatEmployee } from "../../users/EmailIdentifiedCatEmployee.js";

export class PictureTagService implements ServePictureTags {
    constructor(
        private readonly catEmployees: ManageCatEmployees,
        private readonly pictures: ManagePictures,
        private readonly pictureTags: ManagePictureTags,
    ) {}

    async promoteTag(
        pictureId: number,
        tagId: number,
        authenticatedUser: EmailIdentifiedCatEmployee,
    ): Promise<PictureTag | null> {
        await this.verifyCatEmployeeOwnsPicture(pictureId, authenticatedUser);

        return await this.pictureTags.promotePictureTag(pictureId, tagId);
    }

    async addTag(pictureId: number, tag: string, authenticatedUser: EmailIdentifiedCatEmployee): Promise<PictureTag> {
        await this.verifyCatEmployeeOwnsPicture(pictureId, authenticatedUser);

        return await this.pictureTags.getOrAddTag(pictureId, tag.toLowerCase());
    }

    async deleteTag(pictureId: number, tagId: number, authenticatedUser: EmailIdentifiedCatEmployee): Promise<void> {
        const picture = await this.pictures.findById(pictureId);

        if (!picture) {
            await this.pictureTags.deletePictureTag(pictureId, tagId);
            return;
        }

        const employee = await this.catEmployees.findByEmail(authenticatedUser.email);

        if (!employee || picture.catEmployeeId != employee.id) throw new IncorrectEmployeeException();

        await this.pictureTags.deletePictureTag(pictureId, tagId);
    }

    async verifyCatEmployeeOwnsPicture(
        pictureId: number,
        authenticatedUser: EmailIdentifiedCatEmployee,
    ): Promise<void> {
        const picture = await this.pictures.findById(pictureId);

        if (!picture) throw new PictureNotFoundException(pictureId);

        const employee = await this.catEmployees.findByEmail(authenticatedUser.email);

        if (!employee || picture.catEmployeeId != employee.id) throw new IncorrectEmployeeException();
    }
}
