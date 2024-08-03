import { ManagePictureTags } from "./ManagePictureTags.js";
import { PictureTag } from "./PictureTag.js";
import { Tag } from "../../../transfer/index.js";
import { Database } from "better-sqlite3";

const selectFromPictureTags = `
SELECT
    pt.tag_id as tagId,
    pt.picture_id as pictureId,
    t.tag,
    pt.rank
FROM picture_tag pt
JOIN tag t ON t.id = pt.tag_id
`;
export class PictureTagRepository implements ManagePictureTags {
    constructor(private readonly database: Database) {}

    async getOrAddTag(pictureId: number, tag: string): Promise<PictureTag> {
        let newTag: Tag | null;

        const tagStatement = this.database.prepare<string>("INSERT INTO tag (tag) VALUES (?)");
        while ((newTag = this.getTagByName(tag)) == null) {
            tagStatement.run(tag);
        }

        const pictureTagStatement = this.database.prepare<[number, number]>(
            "INSERT INTO picture_tag (tag_id, picture_id) VALUES (?, ?)",
        );

        let pictureTag: PictureTag | null = null;
        while ((pictureTag = this.getPictureTag(pictureId, newTag.id)) == null) {
            pictureTagStatement.run(newTag.id, pictureId);
        }

        return pictureTag;
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

    async promotePictureTag(pictureId: number, tagId: number): Promise<PictureTag | null> {
        this.database
            .prepare<[number, number]>(
                `UPDATE picture_tag
                 SET rank = (SELECT MAX(rank) + 1 FROM picture_tag WHERE picture_id = ? and tag_id = ?)
                 WHERE picture_id = ?
                   and tag_id = ?`,
            )
            .run(pictureId, tagId);

        return this.getPictureTag(pictureId, tagId);
    }

    getTagByName(tag: string): Tag {
        const statement = this.database.prepare<string>("SELECT * FROM tag WHERE tag = ?");

        return statement.get(tag) as Tag;
    }

    getPictureTag(pictureId: number, tagId: number) {
        const statement = this.database.prepare<[number, number]>(
            `${selectFromPictureTags} WHERE picture_id = ? and tag_id = ?`,
        );

        return statement.get(pictureId, tagId) as PictureTag;
    }
}
