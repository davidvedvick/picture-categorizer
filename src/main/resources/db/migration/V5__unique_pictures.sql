ALTER TABLE "picture"
    ADD CONSTRAINT ix_unique_picture UNIQUE("user_id", "file_name")