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
    file_name varchar(255) NOT NULL,
    cat_employee_id MEDIUMINT NOT NULL,
    `file` LONGBLOB,
    CONSTRAINT
        FOREIGN KEY (cat_employee_id) references cat_employee(`id`)
           ON DELETE RESTRICT
           ON UPDATE RESTRICT,
    UNIQUE (cat_employee_id, file_name)
);

create table if not exists picture_attribute
(
    id MEDIUMINT AUTO_INCREMENT primary key,
    name       varchar(50),
    value      varchar(100),
    picture_id MEDIUMINT null,
    CONSTRAINT
        FOREIGN KEY (`picture_id`) REFERENCES picture(`id`)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT
);

