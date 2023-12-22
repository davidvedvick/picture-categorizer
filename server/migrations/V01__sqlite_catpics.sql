create table if not exists cat_employee
(
    id MEDIUMINT AUTO_INCREMENT UNIQUE primary key,
    email      varchar(120) UNIQUE,
    password   varchar(128),
    is_enabled boolean default false
);

create table if not exists picture
(
    id  MEDIUMINT AUTO_INCREMENT primary key,
    cat_employee_id MEDIUMINT NOT NULL,
    file_name varchar(255) NOT NULL,
    mime_type varchar(50),
    `file` LONGBLOB,
    FOREIGN KEY (cat_employee_id) references cat_employee(`id`)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT,
    UNIQUE (cat_employee_id, file_name)
);

create table if not exists tag
(
    id MEDIUMINT AUTO_INCREMENT primary key,
    tag varchar(50) UNIQUE
);

create table if not exists picture_tag
(
    picture_id MEDIUMINT,
    tag_id MEDIUMINT,
    FOREIGN KEY (`picture_id`) REFERENCES picture(`id`)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT,
    FOREIGN KEY (`tag_id`) REFERENCES tag(`id`)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT,
    UNIQUE(picture_id, tag_id)
);