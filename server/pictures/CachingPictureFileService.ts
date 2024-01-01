import PictureFile from "./PictureFile.js";
import QuickLRU from "quick-lru";
import { ServePictureFiles, ServeResizedPictureFiles } from "./ServePictureFiles.js";
import { DiskCache } from "../DiskCache.js";
import { Database } from "better-sqlite3";
import { ManagePictures } from "./ManagePictures.js";

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
    private readonly cache: DiskCache;

    constructor(
        private readonly inner: ServeResizedPictureFiles,
        private readonly managePictures: ManagePictures,
        database: Database,
    ) {
        this.cache = new DiskCache(database, "resized-pics", 100);
    }

    async getPictureFile(id: number): Promise<PictureFile | null> {
        const cacheKey = `${id}:400`;
        const cachedFile = this.cache.get(cacheKey);
        if (cachedFile) {
            const picture = await this.managePictures.findById(id);
            if (!picture) return null;

            return {
                file: cachedFile,
                fileName: picture.fileName,
                mimeType: picture.fileName,
            };
        }

        const pictureFile = await this.inner.getPictureFile(id);
        const file = pictureFile?.file;

        if (file) {
            this.cache.set(cacheKey, Buffer.from(file.buffer));
        }

        return pictureFile;
    }
}
