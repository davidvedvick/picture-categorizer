ALTER TABLE "user"
RENAME "user_name" TO "email";

ALTER TABLE "user" ALTER COLUMN "email" TYPE VARCHAR(120)