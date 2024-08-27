import { Database } from "better-sqlite3";
import { ResizedPicture } from "./ResizedPicture.js";
import { ResizedPictureId } from "./ResizedPictureId.js";
import { ResizePictureRequest } from "./ResizePictureRequest.js";
import { ManageResizedPictures } from "./ManageResizedPictures.js";

const selectResizedPictureIds = `
    SELECT id as id
    FROM resized_picture
`;

export class ResizedPictureRepository implements ManageResizedPictures {
    constructor(private readonly database: Database) {}

    delete(id: number): void {
        this.database.prepare<number>("DELETE FROM resized_picture WHERE picture_id = ?").run(id);
    }

    findByRequest(resizePictureRequest: ResizePictureRequest): ResizedPictureId | null {
        const statement = this.database.prepare<ResizePictureRequest>(
            `${selectResizedPictureIds} WHERE picture_id = @pictureId AND maxWidth = @maxWidth and maxHeight = @maxHeight`,
        );

        const result = statement.get(resizePictureRequest) as ResizedPictureId;

        return result ?? null;
    }

    findById(id: number): ResizedPictureId | null {
        const statement = this.database.prepare<number>(`${selectResizedPictureIds} WHERE id = ?`);

        return (statement.get(id) as ResizedPictureId) ?? null;
    }

    findFileById(id: number): Buffer {
        const statement = this.database.prepare<number>("SELECT file FROM resized_picture WHERE id = ?");

        const result = statement.get(id) as { file: Buffer };
        return result?.file ?? Buffer.of();
    }

    save(picture: ResizedPicture): ResizedPictureId {
        const statement = this.database.prepare<{
            pictureId: number;
            maxWidth: number;
            maxHeight: number;
            file: Buffer;
        }>(
            "INSERT INTO resized_picture (picture_id, maxWidth, maxHeight, file) VALUES (@pictureId, @maxWidth, @maxHeight, @file)",
        );

        const result = statement.run(picture);

        return new ResizedPictureId(result.lastInsertRowid as number);
    }
}
