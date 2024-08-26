import { PictureInformation } from "../../../transfer";
import { Page } from "../Page";
import { AuthenticatedFetch } from "../Security/UserModel";

export interface AccessPictures {
    getPictures(pageNumber: number, pageSize: number): Promise<Page<PictureInformation>>;
    getPictureInformation(pictureId: number): Promise<PictureInformation | null>;
    deletePicture(pictureId: number): Promise<void>;
}

export class PictureAccess implements AccessPictures {
    constructor(private readonly authenticatedFetch: AuthenticatedFetch) {}

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

    async deletePicture(pictureId: number): Promise<void> {
        const response = await this.authenticatedFetch.fetchAuthenticated(`/api/pictures/${pictureId}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Response was not OK.");
    }
}
