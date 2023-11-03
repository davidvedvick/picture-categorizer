import {ManagePictures} from "./ManagePictures.js";
import {Picture} from "./Picture.js";
import mysql from 'mysql2/promise';

const selectFromPictures = `
SELECT
    id as id,
    cat_employee_id as catEmployeeId,
    file_name as fileName
FROM picture
`;

export class PictureRepository implements ManagePictures {

    private readonly connection = await mysql.createConnection({});

    async countAll(): Promise<number> {
        const [rows, _] = await this.connection.execute<number[]>(`SELECT COUNT(*) FROM picture`);
        return rows.length > 0 ? rows[0] : 0;
    }

    findAll(pageNumber: Number, pageSize: Number): Promise<Picture[]>;
    findAll(): Promise<Picture[]>;
    async findAll(pageNumber?: number, pageSize?: number): Promise<Picture[]> {
        let sql = selectFromPictures;
        if (pageNumber && pageSize) {
            sql += `ORDER BY id DESC LIMIT ?,?`;
        }

        const [pictures, _] = await this.connection.execute<Picture[]>(sql, [pageNumber, pageSize]);
        return pictures;
    }

    async findByCatEmployeeIdAndFileName(catEmployeeId: number, fileName: String): Promise<Picture | null> {
        const [pictures, _] = await this.connection.execute<Picture[]>(
            `${selectFromPictures} WHERE cat_employee_id = ? AND file_name = ?`,
            [catEmployeeId, fileName]);

        return pictures.length > 0 ? pictures[0] : null;
    }

    async findById(id: number): Promise<Picture | null> {
        const [pictures, _] = await this.connection.execute<Picture[]>(
            `${selectFromPictures} WHERE id = ?`,
            [id]);

        return pictures.length > 0 ? pictures[0] : null;
    }

    async findFileById(id: number): Promise<Uint8Array> {
        const [pictures, _] = await this.connection.execute<Picture[]>(
            `SELECT file FROM picture WHERE id = ?`,
            [id]);

        return pictures.length > 0 ? pictures[0].file : Buffer.of();
    }

    async save(picture: Picture): Promise<Picture> {
        await this.connection.execute<Picture[]>(
            `INSERT INTO picture (cat_employee_id, file_name, file)
             VALUES (?, ?, ?)`,
            [picture.userId, picture.fileName, picture.file]);

        return picture;
    }
}