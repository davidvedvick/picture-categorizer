import {ServePictures} from "./ServePictures.js";
import {PictureResponse} from "./PictureResponse.js";
import {AuthenticatedCatEmployee} from "../security/AuthenticatedCatEmployee.js";
import {Page} from "../Page.js";
import {ManagePictures} from "./ManagePictures.js";

export class PictureService implements ServePictures {

    constructor(private readonly pictureManagement: ManagePictures) {}

    addPicture(pictureFile: PictureFile, authenticatedCatEmployee: AuthenticatedCatEmployee): Promise<PictureResponse> {
        return this.pictureManagement.save({
            userId: 0,
            id: 0,
            file: pictureFile.file,
            fileName: pictureFile.fileName,
        });
    }

    async getPictures(pageNumber: Number | null = null, pageSize: Number | null = null): Promise<Page<PictureResponse>> {
        const pictures = await this.pictureManagement.findAll(pageNumber, pageSize);
        const count = this.pictureManagement.countAll();

        return {
            content: pictures,
            last: (await count) <= (pageNumber + 1) * pageSize
        }
    }
}