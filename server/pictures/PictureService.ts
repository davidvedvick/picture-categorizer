import {ServePictureInformation} from "./ServePictureInformation.js";
import {AuthenticatedCatEmployee} from "../users/AuthenticatedCatEmployee.js";
import {Page} from "../Page.js";
import {ManagePictures} from "./ManagePictures.js";
import PictureFile from "./PictureFile.js";
import {Picture} from "./Picture.js";
import {ManageCatEmployees} from "../users/ManageCatEmployees.js";
import {PictureAlreadyExistsException} from "./PictureAlreadyExistsException.js";
import {UnknownCatEmployeeException} from "../users/UnknownCatEmployeeException.js";
import {PictureInformation} from "../../transfer/index.js";
import {ServePictureFiles} from "./ServePictureFiles.js";
import {ManagePictureTags} from "./tags/ManagePictureTags.js";

function toPictureResponse(picture: Picture): PictureInformation {
    return {
        fileName: picture.fileName,
        id: picture.id,
        tags: [],
    };
}

export class PictureService implements ServePictureInformation, ServePictureFiles {

    constructor(
        private readonly pictureManagement: ManagePictures,
        private readonly catEmployees: ManageCatEmployees,
        private readonly pictureTagManagement: ManagePictureTags) {}

    async addPicture(pictureFile: PictureFile, authenticatedCatEmployee: AuthenticatedCatEmployee): Promise<PictureInformation> {
        const employee = await this.catEmployees.findByEmail(authenticatedCatEmployee.email);

        if (!employee) {
            throw new UnknownCatEmployeeException(authenticatedCatEmployee.email)
        }

        const existingPicture = await this.pictureManagement.findByCatEmployeeIdAndFileName(employee.id, pictureFile.fileName);
        if (existingPicture) {
            throw new PictureAlreadyExistsException(pictureFile, employee);
        }

        const picture = await this.pictureManagement.save(Object.assign(
            {
                catEmployeeId: employee.id,
                id: 0,
            },
            pictureFile));

        return toPictureResponse(picture);
    }

    async getPictureInformation(pageNumber: number | null = null, pageSize: number | null = null): Promise<Page<PictureInformation>> {
        const promisedPictures = this.pictureManagement.findAll(pageNumber, pageSize);

        let isLast = true;
        if (pageNumber != null && pageSize != null) {
            const count = await this.pictureManagement.countAll();
            isLast = count <= (pageNumber + 1) * pageSize;
        }

        const pictures = await promisedPictures;
        const taggedPictures = await Promise.all(pictures.map(async p => {
            const promisedTags = this.pictureTagManagement.getPictureTags(p.id);
            const response = toPictureResponse(p);
            response.tags = (await promisedTags).map(t => {
                return {
                    tag: t.tag,
                    id: t.tagId,
                }
            });
            return response;
        }));

        return {
            content: taggedPictures,
            number: pageNumber ?? 0,
            last: isLast,
        };
    }

    async getPictureFile(id: number): Promise<PictureFile | null> {
        const picture = await this.pictureManagement.findById(id);
        const promisedData = this.pictureManagement.findFileById(id);

        if (!picture) return null;

        return {
            file: await promisedData,
            mimeType: picture.mimeType,
            fileName: picture.fileName,
        };
    }
}