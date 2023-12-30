create table if not exists cat_employee
(
    id INTEGER primary key,
    email      varchar(120) UNIQUE,
    password   varchar(128),
    is_enabled boolean default false
);

create table if not exists picture
(
    id  INTEGER primary key,
    cat_employee_id INTEGER NOT NULL,
    file_name varchar(255) NOT NULL,
    mime_type varchar(50),
    `file` BLOB,
    FOREIGN KEY (cat_employee_id) references cat_employee(`id`)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT,
    UNIQUE (cat_employee_id, file_name)
);

create table if not exists tag
(
    id INTEGER primary key,
    tag varchar(50) UNIQUE
);

create table if not exists picture_tag
(
    picture_id INTEGER,
    tag_id INTEGER,
    FOREIGN KEY (`picture_id`) REFERENCES picture(`id`)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT,
    FOREIGN KEY (`tag_id`) REFERENCES tag(`id`)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT,
    UNIQUE(picture_id, tag_id)
);