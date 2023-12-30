import fg from "fast-glob";
import fs from "fs/promises";
import path from "path";
import { Database } from "better-sqlite3";

export default async function (database: Database) {
    const files = await fg.async("migrations/*.sql");

    database.exec(`
        create table if not exists migrations
        (
            id          INT primary key,
            file        varchar(2000) UNIQUE,
            executed_on DATETIME
        );`);

    const resultsQuery = database.prepare<string>(
        `SELECT *
         FROM migrations
         WHERE file = ?`,
    );

    const migrationRecordInsert = database.prepare<[string, string]>(
        `INSERT INTO migrations (file, executed_on)
         VALUES (?, ?)`,
    );

    for (const file of files.sort()) {
        const fileName = path.basename(file);

        const result = resultsQuery.get(fileName);
        if (result) continue;

        const buffer = await fs.readFile(file);
        const sql = buffer.toString();
        database.exec(sql);

        migrationRecordInsert.run(fileName, new Date().toISOString().slice(0, 19).replace("T", " "));
    }
}
