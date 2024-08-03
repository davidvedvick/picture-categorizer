import { PictureInformation } from "../../../transfer";
import { Page } from "../Page";

export interface AccessPictures {
    getPictures(pageNumber: number, pageSize: number): Promise<Page<PictureInformation>>;
    getPictureInformation(pictureId: number): Promise<PictureInformation | null>;
}

export class PictureAccess implements AccessPictures {
    async getPictures(pageNumber: number, pageSize: number): Promise<Page<PictureInformation>> {
        const response = await fetch(`/api/pictures?page=${pageNumber}&size=${pageSize}`);
        if (!response.ok) throw new Error("Response was not OK.");
        return await response.json();
    }

    async getPictureInformation(pictureId: number): Promise<PictureInformation | null> {
        const response = await fetch(`/api/pictures/${pictureId}`);
        if (!response.ok) throw new Error("Response was not OK.");
        return await response.json();
    }
}
