create table if not exists resized_picture
(
    id INTEGER primary key,
    picture_id INTEGER,
    maxWidth INTEGER,
    maxHeight INTEGER,
    `file` BLOB,
    FOREIGN KEY (`picture_id`) REFERENCES picture(`id`)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT,
    UNIQUE(picture_id, maxWidth, maxHeight)
);

drop table if exists disk_cache;