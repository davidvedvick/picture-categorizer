drop table if exists picture_attribute;

create table if not exists tag
(
    id MEDIUMINT AUTO_INCREMENT primary key,
    tag varchar(100) UNIQUE
);

create table if not exists picture_tag
(
    picture_id MEDIUMINT,
    tag_id MEDIUMINT,
    CONSTRAINT
        FOREIGN KEY (`picture_id`) REFERENCES picture(`id`)
            ON DELETE RESTRICT
            ON UPDATE RESTRICT,
    CONSTRAINT
        FOREIGN KEY (`tag_id`) REFERENCES tag(`id`)
            ON DELETE RESTRICT
            ON UPDATE RESTRICT,
    UNIQUE(picture_id, tag_id)
);