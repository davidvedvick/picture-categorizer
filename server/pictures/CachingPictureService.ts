import {ServePictures} from "./ServePictures.js";
import PictureFile from "./PictureFile.js";
import {AuthenticatedCatEmployee} from "../users/AuthenticatedCatEmployee.js";
import {PictureInformation} from "../../transfer/index.js";
import {Page} from "../Page.js";
import QuickLRU from "quick-lru";

export class CachingPictureService implements ServePictures {

    private readonly cache = new QuickLRU<number, PictureFile | null>({
        maxSize: 80, // ~32MB
        maxAge: 3 * 86_400_000, // 3 days
    });

    constructor(private readonly inner: ServePictures) {}

    addPicture(pictureFile: PictureFile, authenticatedCatEmployee: AuthenticatedCatEmployee): Promise<PictureInformation> {
        return this.inner.addPicture(pictureFile, authenticatedCatEmployee);
    }

    async getPictureFile(id: number): Promise<PictureFile | null> {
        const cachedFile = this.cache.get(id);
        if (cachedFile !== undefined) return cachedFile;

        const pictureFile = await this.inner.getPictureFile(id);

        this.cache.set(id, pictureFile);

        return pictureFile;
    }

    getPictureInformation(pageNumber: number | null, pageSize: number | null): Promise<Page<PictureInformation>> {
        return this.inner.getPictureInformation(pageNumber, pageSize);
    }
}