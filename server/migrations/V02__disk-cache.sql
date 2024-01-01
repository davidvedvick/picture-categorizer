create table if not exists disk_cache
(
    id INTEGER primary key,
    cache_name varchar,
    `key` varchar,
    `last_accessed_time` BIGINT,
    value BLOB
);

CREATE UNIQUE INDEX IF NOT EXISTS `IX_CACHE_NAME_KEY_UNIQUE` ON disk_cache(`cache_name`,`key`);