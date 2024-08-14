import { Database } from "better-sqlite3";

export class DiskCache {
    constructor(
        private readonly database: Database,
        private readonly cacheName: string,
        private readonly sizeInMegabytes: number = 0,
        private readonly accessStalenessMs: number = 0,
    ) {}

    set(cacheKey: string, value: Buffer) {
        const statement = this.database.prepare<{
            cacheName: string;
            key: string;
            value: Buffer;
            lastAccessedTime: number;
        }>(
            `INSERT INTO disk_cache (cache_name, key, value, last_accessed_time) VALUES (@cacheName, @key, @value, @lastAccessedTime)
             ON CONFLICT(\`cache_name\`,\`key\`) DO UPDATE SET last_accessed_time = @lastAccessedTime, value = @value`,
        );

        statement.run({
            cacheName: this.cacheName,
            key: cacheKey,
            lastAccessedTime: Date.now(),
            value: value,
        });

        this.trimCache();
    }

    get(cacheKey: string) {
        const statement = this.database.prepare<[string, string]>(
            "SELECT id, value FROM disk_cache WHERE cache_name = ? and `key` = ?",
        );

        const result = statement.get(this.cacheName, cacheKey);
        if (!result) return null;

        const { id, value } = result as { id: number; value: Buffer };

        const update = this.database.prepare<[number, number]>(
            "UPDATE disk_cache SET last_accessed_time = ? WHERE id = ?",
        );

        update.run(Date.now(), id);

        return value;
    }

    private trimCache() {
        if (this.accessStalenessMs > 0) {
            this.database
                .prepare<number>("DELETE FROM disk_cache WHERE last_accessed_time < ?")
                .run(Date.now() - this.accessStalenessMs);
        }

        if (this.sizeInMegabytes <= 0) return;

        const sizeStatement = this.database.prepare(
            "SELECT (SUM(LENGTH(value)) / 1024 / 1024) as size FROM disk_cache WHERE cache_name = ?",
        );
        const cacheName = this.cacheName;

        function getSizeInMegabytes() {
            const result = sizeStatement.get(cacheName) as { size: number };
            return result.size;
        }

        const getOldestFileStatement = this.database.prepare<string>(
            `SELECT id
FROM disk_cache 
WHERE cache_name = ?
ORDER BY last_accessed_time DESC
LIMIT 1`,
        );

        const deleteFileStatement = this.database.prepare<number>("DELETE FROM disk_cache WHERE id = ?");

        while (getSizeInMegabytes() > this.sizeInMegabytes) {
            const result = getOldestFileStatement.get(cacheName);
            if (!result) return;

            const { id } = result as { id: number };
            deleteFileStatement.run(id);
        }
    }
}
