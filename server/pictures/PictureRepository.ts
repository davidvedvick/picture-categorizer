import { ManagePictures } from "./ManagePictures.js";
import { Picture } from "./Picture.js";
import { Database } from "better-sqlite3";

const selectFromPictures = `
SELECT
    id as id,
    cat_employee_id as catEmployeeId,
    file_name as fileName,
    mime_type as mimeType
FROM picture
`;
export class PictureRepository implements ManagePictures {
    constructor(private readonly database: Database) {}

    async countAll(): Promise<number> {
        const statement = this.database.prepare("SELECT COUNT(*) as count FROM picture");
        const result = statement.get() as { count: number };
        return result.count;
    }

    async findAll(pageNumber: number | null, pageSize: number | null): Promise<Picture[]> {
        let sql = selectFromPictures;

        let offset = 0;
        if (pageNumber != null && pageSize != null) {
            sql += "ORDER BY id DESC LIMIT ?,?";
            offset = pageNumber * pageSize;
        }

        const statement = this.database.prepare<[number | null, number | null]>(sql);
        return statement.all(offset, pageSize) as Picture[];
    }

    async findByCatEmployeeIdAndFileName(catEmployeeId: number, fileName: string): Promise<Picture | null> {
        const statement = this.database.prepare<[number, string]>(
            `${selectFromPictures} WHERE cat_employee_id = ? AND file_name = ?`,
        );

        const result = statement.get(catEmployeeId, fileName) as Picture;

        return result ?? null;
    }

    async findById(id: number): Promise<Picture | null> {
        const statement = this.database.prepare<number>(`${selectFromPictures} WHERE id = ?`);

        return (statement.get(id) as Picture) ?? null;
    }

    async findFileById(id: number): Promise<Uint8Array> {
        const statement = this.database.prepare<number>("SELECT file FROM picture WHERE id = ?");

        const result = statement.get(id) as { file: Uint8Array };
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
