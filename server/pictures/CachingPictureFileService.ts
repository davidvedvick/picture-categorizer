import PictureFile from "./PictureFile.js";
import QuickLRU from "quick-lru";
import {ServePictureFiles, ServeResizedPictureFiles} from "./ServePictureFiles.js";

export class CachingPictureFileService implements ServePictureFiles {

    private readonly cache = new QuickLRU<number, PictureFile | null>({
        maxSize: 10, // Unknown...
        maxAge: 3 * 86_400_000, // 3 days
    });

    constructor(private readonly inner: ServePictureFiles) {}

    async getPictureFile(id: number): Promise<PictureFile | null> {
        const cachedFile = this.cache.get(id);
        if (cachedFile !== undefined) return cachedFile;

        const pictureFile = await this.inner.getPictureFile(id);

        this.cache.set(id, pictureFile);

        return pictureFile;
    }
}

export class CachingResizedPictureFileService implements ServeResizedPictureFiles {

    private readonly cache = new QuickLRU<number, PictureFile | null>({
        maxSize: 80, // ~32MB
    });

    constructor(private readonly inner: ServeResizedPictureFiles) {}

    async getPictureFile(id: number): Promise<PictureFile | null> {
        const cachedFile = this.cache.get(id);
        if (cachedFile !== undefined) return cachedFile;

        const pictureFile = await this.inner.getPictureFile(id);

        this.cache.set(id, pictureFile);

        return pictureFile;
    }
}