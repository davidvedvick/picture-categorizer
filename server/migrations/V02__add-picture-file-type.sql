IF (SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = 'db_name'
      AND TABLE_NAME = 'picture'
      AND COLUMN_NAME = 'mime_type') = 0 THEN

  ALTER TABLE picture ADD mime_type varchar(50);

  UPDATE picture set picture.mime_type = 'image/jpeg' WHERE COALESCE(picture.mime_type, '') = '';

end if;
