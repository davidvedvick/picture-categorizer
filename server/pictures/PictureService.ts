import {ServePictures} from "./ServePictures.js";
import {PictureResponse} from "./PictureResponse.js";
import {AuthenticatedCatEmployee} from "../security/AuthenticatedCatEmployee.js";
import {Page} from "../Page.js";
import {ManagePictures} from "./ManagePictures.js";
import PictureFile from "./PictureFile.js";
import {Picture} from "./Picture.js";

function toPictureResponse(picture: Picture): PictureResponse {
    return {
        fileName: picture.fileName,
        id: picture.id,
        userId: picture.catEmployeeId,
    };
}

export class PictureService implements ServePictures {

    constructor(private readonly pictureManagement: ManagePictures) {}

    async addPicture(pictureFile: PictureFile, authenticatedCatEmployee: AuthenticatedCatEmployee): Promise<PictureResponse> {
        const picture = await this.pictureManagement.save({
            catEmployeeId: 0,
            id: 0,
            file: pictureFile.file,
            fileName: pictureFile.fileName,
        });

        return toPictureResponse(picture);
    }

    async getPictures(pageNumber: number | null = null, pageSize: number | null = null): Promise<Page<PictureResponse>> {
        const promisedPictures = this.pictureManagement.findAll(pageNumber, pageSize);

        let isLast = true;
        if (pageNumber && pageSize) {
            const count = await this.pictureManagement.countAll();
            isLast = count <= (pageNumber + 1) * pageSize;
        }

        const pictures = await promisedPictures;

        return {
            content: pictures.map(toPictureResponse),
            last: isLast,
        }
    }
}