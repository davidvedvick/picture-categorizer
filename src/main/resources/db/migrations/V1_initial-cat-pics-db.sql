CREATE TABLE "user" (
  id BIGINT SERIAL,
   user_name VARCHAR(50),
   password VARCHAR(128), -- Populate with SHA-512 hashed passwords
   CONSTRAINT pk_user PRIMARY KEY (id)
);

CREATE TABLE picture (
  id BIGINT SERIAL,
   path VARCHAR(4000),
   user_id BIGINT,
   CONSTRAINT pk_picture PRIMARY KEY (id)
);

ALTER TABLE picture ADD CONSTRAINT FK_PICTURE_ON_USER FOREIGN KEY (user_id) REFERENCES "user" (id);

CREATE TABLE picture_attribute (
  id BIGINT SERIAL,
   name VARCHAR(50),
   value VARCHAR(100),
   picture_id BIGINT,
   CONSTRAINT pk_pictureattribute PRIMARY KEY (id)
);

ALTER TABLE picture_attribute ADD CONSTRAINT FK_PICTUREATTRIBUTE_ON_PICTURE FOREIGN KEY (picture_id) REFERENCES picture (id);

