import {ManagePictures} from "./ManagePictures.js";
import {Picture} from "./Picture.js";
import {Pool, ResultSetHeader, RowDataPacket} from 'mysql2/promise';

const selectFromPictures = `
SELECT
    id as id,
    cat_employee_id as catEmployeeId,
    file_name as fileName
FROM picture
`;

export class PictureRepository implements ManagePictures {

    constructor(private readonly pool: Pool) {}

    async countAll(): Promise<number> {
        const [rows, _] = await this.pool.execute<RowDataPacket[]>(`SELECT COUNT(*) as count FROM picture`);
        return rows.length > 0 ? rows[0].count : 0;
    }

    async findAll(pageNumber: number | null, pageSize: number | null): Promise<Picture[]> {
        let sql = selectFromPictures;
        if (pageNumber && pageSize) {
            sql += `ORDER BY id DESC LIMIT ?,?`;
        }

        const [pictures, _] = await this.pool.execute<RowDataPacket[]>(sql, [pageNumber, pageSize]);
        return pictures.map(p => p as Picture);
    }

    async findByCatEmployeeIdAndFileName(catEmployeeId: number, fileName: String): Promise<Picture | null> {
        const [pictures, _] = await this.pool.execute<RowDataPacket[]>(
            `${selectFromPictures} WHERE cat_employee_id = ? AND file_name = ?`,
            [catEmployeeId, fileName]);

        return pictures.length > 0 ? pictures[0] as Picture : null;
    }

    async findById(id: number): Promise<Picture | null> {
        const [pictures, _] = await this.pool.execute<RowDataPacket[]>(
            `${selectFromPictures} WHERE id = ?`,
            [id]);

        return pictures.length > 0 ? pictures[0] as Picture : null;
    }

    async findFileById(id: number): Promise<Uint8Array> {
        const [pictures, _] = await this.pool.execute<RowDataPacket[]>(
            `SELECT file FROM picture WHERE id = ?`,
            [id]);

        return pictures.length > 0 ? pictures[0].file : Buffer.of();
    }

    async save(picture: Picture): Promise<Picture> {
        const [result, _] = await this.pool.execute<ResultSetHeader>(
            `INSERT INTO picture (cat_employee_id, file_name, file)
             VALUES (?, ?, ?)`,
            [picture.catEmployeeId, picture.fileName, picture.file]);

        picture.id = result.insertId;

        return picture;
    }
}