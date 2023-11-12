import {ServePictures} from "./ServePictures.js";
import {PictureResponse} from "./PictureResponse.js";
import {AuthenticatedCatEmployee} from "../users/AuthenticatedCatEmployee.js";
import {Page} from "../Page.js";
import {ManagePictures} from "./ManagePictures.js";
import PictureFile from "./PictureFile.js";
import {Picture} from "./Picture.js";
import {ManageCatEmployees} from "../users/ManageCatEmployees.js";
import {PictureAlreadyExistsException} from "./PictureAlreadyExistsException.js";
import {UnknownCatEmployeeException} from "../users/UnknownCatEmployeeException.js";

function toPictureResponse(picture: Picture): PictureResponse {
    return {
        fileName: picture.fileName,
        id: picture.id,
        userId: picture.catEmployeeId,
    };
}

export class PictureService implements ServePictures {

    constructor(
        private readonly pictureManagement: ManagePictures,
        private readonly catEmployees: ManageCatEmployees) {}

    async addPicture(pictureFile: PictureFile, authenticatedCatEmployee: AuthenticatedCatEmployee): Promise<PictureResponse> {
        const employee = await this.catEmployees.findByEmail(authenticatedCatEmployee.email);

        if (!employee) {
            throw new UnknownCatEmployeeException(authenticatedCatEmployee.email)
        }

        const existingPicture = await this.pictureManagement.findByCatEmployeeIdAndFileName(employee.id, pictureFile.fileName);
        if (existingPicture) {
            throw new PictureAlreadyExistsException(pictureFile, employee);
        }

        const picture = await this.pictureManagement.save({
            catEmployeeId: employee.id,
            id: 0,
            file: pictureFile.file,
            fileName: pictureFile.fileName,
        });

        return toPictureResponse(picture);
    }

    async getPictures(pageNumber: number | null = null, pageSize: number | null = null): Promise<Page<PictureResponse>> {
        const promisedPictures = this.pictureManagement.findAll(pageNumber, pageSize);

        let isLast = true;
        if (pageNumber != null && pageSize != null) {
            const count = await this.pictureManagement.countAll();
            isLast = count <= (pageNumber + 1) * pageSize;
        }

        const pictures = await promisedPictures;

        return {
            content: pictures.map(toPictureResponse),
            number: pageNumber ?? 0,
            last: isLast,
        };
    }
}