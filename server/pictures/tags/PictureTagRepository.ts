import { ManagePictureTags } from "./ManagePictureTags.js";
import { PictureTag } from "./PictureTag.js";
import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Tag } from "../../../transfer/index.js";
import { Database } from "better-sqlite3";

const selectFromPictureTags = `
SELECT
    pt.tag_id as tagId,
    pt.picture_id as pictureId,
    t.tag
FROM picture_tag pt
JOIN tag t ON t.id = pt.tag_id
`;

export class PictureTagRepositoryMySql implements ManagePictureTags {
    constructor(private readonly pool: Pool) {}

    async addTag(pictureId: number, tag: string): Promise<PictureTag> {
        let newTag: Tag | null;
        while ((newTag = await this.getTagByName(tag)) == null) {
            await this.pool.execute<ResultSetHeader>("INSERT INTO tag (tag) VALUES (?)", [tag]);
        }

        await this.pool.execute<ResultSetHeader>("INSERT INTO picture_tag (tag_id, picture_id) VALUES (?, ?)", [
            newTag.id,
            pictureId,
        ]);

        return {
            pictureId: pictureId,
            tagId: newTag.id,
            tag: tag,
        };
    }

    async deletePictureTag(pictureId: number, tagId: number): Promise<void> {
        await this.pool.execute<ResultSetHeader>("DELETE FROM picture_tag WHERE tag_id = ? and picture_id = ?", [
            tagId,
            pictureId,
        ]);
    }

    async getPictureTags(pictureId: number): Promise<PictureTag[]> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(`${selectFromPictureTags} WHERE picture_id = ?`, [
            pictureId,
        ]);

        return rows.map((r) => r as PictureTag);
    }

    async getAll(): Promise<PictureTag[]> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(selectFromPictureTags);

        return rows.map((r) => r as PictureTag);
    }

    private async getTagByName(tag: string) {
        const [rows] = await this.pool.execute<RowDataPacket[]>("SELECT * FROM tag WHERE tag = ?", [tag]);

        return rows.length > 0 ? (rows[0] as Tag) : null;
    }
}

export class PictureTagRepositorySqLite implements ManagePictureTags {
    constructor(private readonly database: Database) {}

    async addTag(pictureId: number, tag: string): Promise<PictureTag> {
        let newTag: Tag | null;

        const tagStatement = this.database.prepare<string>("INSERT INTO tag (tag) VALUES (?)");
        while ((newTag = this.getTagByName(tag)) == null) {
            tagStatement.run(tag);
        }

        const pictureTagStatement = this.database.prepare<[number, number]>(
            "INSERT INTO picture_tag (tag_id, picture_id) VALUES (?, ?)",
        );

        pictureTagStatement.run(newTag.id, pictureId);

        return {
            pictureId: pictureId,
            tagId: newTag.id,
            tag: tag,
        };
    }

    async deletePictureTag(pictureId: number, tagId: number): Promise<void> {
        this.database
            .prepare<[number, number]>("DELETE FROM picture_tag WHERE tag_id = ? and picture_id = ?")
            .run(tagId, pictureId);
    }

    async getPictureTags(pictureId: number): Promise<PictureTag[]> {
        const statement = this.database.prepare<number>(`${selectFromPictureTags} WHERE picture_id = ?`);

        return statement.all(pictureId) as PictureTag[];
    }

    private getTagByName(tag: string) {
        const statement = this.database.prepare<string>("SELECT * FROM tag WHERE tag = ?");

        return statement.get(tag) as Tag;
    }
}
