import { RowDataPacket } from "mysql2/promise";
import fg from "fast-glob";
import fs from "fs/promises";
import { ConnectionOptions } from "mysql2";
import mysql from "mysql2/promise";
import path from "path";

export default async function (options: ConnectionOptions) {
    const files = await fg.async("migrations/*.sql");
    const migrationOptions = Object.assign({} as ConnectionOptions, options);
    migrationOptions.multipleStatements = true;
    const connection = await mysql.createConnection(migrationOptions);

    try {
        await connection.execute(`
            create table if not exists migrations
            (
                id          MEDIUMINT AUTO_INCREMENT UNIQUE primary key,
                file        varchar(2000) UNIQUE,
                executed_on DATETIME
            );`);

        for (const file of files.sort()) {
            const fileName = path.basename(file);
            const [results] = await connection.execute<RowDataPacket[]>(
                `SELECT *
                 FROM migrations
                 WHERE file = ?`,
                [fileName],
            );

            if (results.length > 0) continue;

            const buffer = await fs.readFile(file);
            const sql = buffer.toString();
            await connection.query(sql);

            await connection.execute(
                `INSERT INTO migrations (file, executed_on)
                 VALUES (?, ?)`,
                [fileName, new Date().toISOString().slice(0, 19).replace("T", " ")],
            );
        }
    } finally {
        connection.destroy();
    }
}
