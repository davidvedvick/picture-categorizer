ALTER TABLE "picture"
ADD COLUMN "file" bytea;

ALTER TABLE "picture"
    RENAME "path" TO "file_name";

ALTER TABLE "picture" ALTER COLUMN "file_name" TYPE VARCHAR(1024)