import {ServePictures} from "./ServePictures.js";
import {PictureResponse} from "./PictureResponse.js";
import {AuthenticatedCatEmployee} from "../security/AuthenticatedCatEmployee.js";
import {Page} from "../Page.js";
import {ManagePictures} from "./ManagePictures.js";
import PictureFile from "./PictureFile.js";

export class PictureService implements ServePictures {

    constructor(private readonly pictureManagement: ManagePictures) {}

    addPicture(pictureFile: PictureFile, authenticatedCatEmployee: AuthenticatedCatEmployee): Promise<PictureResponse> {
        return this.pictureManagement.save({
            catEmployeeId: 0,
            id: 0,
            file: pictureFile.file,
            fileName: pictureFile.fileName,
        });
    }

    async getPictures(pageNumber: number | null = null, pageSize: number | null = null): Promise<Page<PictureResponse>> {
        const promisedPictures = this.pictureManagement.findAll(pageNumber, pageSize);

        let isLast = true;
        if (pageNumber && pageSize) {
            const count = await this.pictureManagement.countAll();
            isLast = count <= (pageNumber + 1) * pageSize;
        }

        return {
            content: await promisedPictures,
            last: isLast,
        }
    }
}