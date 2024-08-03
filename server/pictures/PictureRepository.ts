import { ManagePictures } from "./ManagePictures.js";
import { Picture } from "./Picture.js";
import { Database } from "better-sqlite3";
import { DescribedPicture } from "./DescribedPicture.js";

const selectFromPictures = `
SELECT
    p.id as id,
    p.cat_employee_id as catEmployeeId,
    p.file_name as fileName,
    p.mime_type as mimeType,
    t.tag as headlineTag
FROM picture p
         LEFT JOIN picture_tag pt on pt.picture_id = p.id
         LEFT JOIN picture_tag pt2
                   ON pt.picture_id = pt2.picture_id AND ((pt.rank < pt2.rank)
                       OR (pt.rank = pt2.rank AND pt.rowid > pt2.rowid))
         LEFT JOIN tag t on t.id = pt.tag_id
WHERE pt2.picture_id IS NULL
`;
export class PictureRepository implements ManagePictures {
    constructor(private readonly database: Database) {}

    async countAll(): Promise<number> {
        const statement = this.database.prepare("SELECT COUNT(*) as count FROM picture");
        const result = statement.get() as { count: number };
        return result.count;
    }

    async findAll(pageNumber: number | null, pageSize: number | null): Promise<DescribedPicture[]> {
        let sql = selectFromPictures;

        let offset = 0;
        if (pageNumber != null && pageSize != null) {
            sql += "ORDER BY p.id DESC LIMIT ?,?";
            offset = pageNumber * pageSize;
        }

        const statement = this.database.prepare<[number | null, number | null]>(sql);
        return statement.all(offset, pageSize) as DescribedPicture[];
    }

    async findByCatEmployeeIdAndFileName(catEmployeeId: number, fileName: string): Promise<DescribedPicture | null> {
        const statement = this.database.prepare<[number, string]>(
            `${selectFromPictures} AND p.cat_employee_id = ? AND p.file_name = ?`,
        );

        const result = statement.get(catEmployeeId, fileName) as DescribedPicture;

        return result ?? null;
    }

    async findById(id: number): Promise<DescribedPicture | null> {
        const statement = this.database.prepare<number>(`${selectFromPictures} AND p.id = ?`);

        return (statement.get(id) as DescribedPicture) ?? null;
    }

    async findFileById(id: number): Promise<Buffer> {
        const statement = this.database.prepare<number>("SELECT file FROM picture p WHERE p.id = ?");

        const result = statement.get(id) as { file: Buffer };
        return result?.file ?? Buffer.of();
    }

    async save(picture: Picture): Promise<Picture> {
        const statement = this.database.prepare<[number, string, Uint8Array, string]>(
            `INSERT INTO picture (cat_employee_id, file_name, file, mime_type)
             VALUES (?, ?, ?, ?)`,
        );

        const result = statement.run(picture.catEmployeeId, picture.fileName, picture.file, picture.mimeType);

        picture.id = result.lastInsertRowid as number;

        return picture;
    }
}
