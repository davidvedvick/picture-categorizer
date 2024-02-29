use sqlite::ConnectionThreadSafe;
use warp::Error;

use crate::pictures::manage_pictures::ManagePictures;
use crate::pictures::picture::Picture;

pub struct PictureRepository {
    connection: ConnectionThreadSafe,
}

impl PictureRepository {
    pub fn new(connection: ConnectionThreadSafe) -> Self {
        Self { connection }
    }
}

const SELECT_FROM_PICTURES: &str = "
SELECT
id,
cat_employee_id,
file_name,
mime_type
FROM picture
";

impl ManagePictures for PictureRepository {
    async fn find_by_id(&self, id: i64) -> Result<Option<Picture>, Error> {
        let picture_option = self
            .connection
            .prepare(format!("{} WHERE id = ?", SELECT_FROM_PICTURES).as_str())
            .unwrap()
            .into_iter()
            .bind((1, id))
            .unwrap()
            .map(|row| {
                let result = row.unwrap();
                Picture {
                    id: result.read::<i64, _>("id"),
                    file_name: result.read::<&str, _>("file_name").to_string(),
                    cat_employee_id: result.read::<i64, _>("cat_employee_id"),
                    file: vec![],
                    mime_type: result.read::<&str, _>("mime_type").to_string(),
                }
            })
            .next();

        Ok(picture_option)
    }

    async fn find_file_by_id(id: u64) -> Option<Result<Vec<u8>, Error>> {
        todo!()
    }

    async fn find_by_cat_employee_id_and_file_name(
        cat_employee_id: u64,
        file_name: String,
    ) -> Option<Result<Picture, Error>> {
        todo!()
    }

    async fn find_all(page_number: u32, page_size: u32) -> Option<Result<Vec<Picture>, Error>> {
        todo!()
    }

    async fn count_all() -> Result<u64, Error> {
        todo!()
    }

    async fn save(picture: Picture) -> Result<Picture, Error> {
        todo!()
    }
}
