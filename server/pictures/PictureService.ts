import {ServePictures} from "./ServePictures.js";

export class PictureService implements ServePictures {
    addPicture(pictureFile: PictureFile, authenticatedCatEmployee: AuthenticatedCatEmployee): PictureResponse {
        return undefined;
    }

    getPictures(pageNumber?: Number | null, pageSize?: Number | null): Promise<Page<PictureResponse>> {
        return Promise.resolve(undefined);
    }

}