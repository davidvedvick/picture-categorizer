use sqlite::{ConnectionThreadSafe, Row, State};
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

unsafe impl Sync for PictureRepository {}

fn row_to_picture(row: Result<Row, impl std::fmt::Debug>) -> Picture {
    let result = row.unwrap();
    Picture {
        id: result.read::<i64, _>("id"),
        file_name: result.read::<&str, _>("file_name").to_string(),
        cat_employee_id: result.read::<i64, _>("cat_employee_id"),
        file: vec![],
        mime_type: result.read::<&str, _>("mime_type").to_string(),
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
            .map(row_to_picture)
            .next();

        Ok(picture_option)
    }

    async fn find_file_by_id(&self, id: i64) -> Result<Option<Vec<u8>>, Error> {
        let mut statement = self
            .connection
            .prepare("SELECT file FROM picture WHERE id = ?")
            .unwrap();

        statement.bind((1, id)).unwrap();

        if let Ok(State::Row) = statement.next() {
            let result = statement.read::<Vec<u8>, usize>(0).unwrap();
            return Ok(Some(result));
        }

        Ok(None)
    }

    async fn find_by_cat_employee_id_and_file_name(
        cat_employee_id: i64,
        file_name: String,
    ) -> Result<Option<Picture>, Error> {
        todo!()
    }

    async fn find_all(
        &self,
        page_number: Option<i32>,
        page_size: Option<i32>,
    ) -> Result<Vec<Picture>, Error> {
        if page_number == None || page_size == None {
            let pictures = self
                .connection
                .prepare(SELECT_FROM_PICTURES)
                .unwrap()
                .into_iter()
                .map(row_to_picture)
                .collect::<Vec<Picture>>();

            return Ok(pictures);
        }

        let offset: i64 = (page_number.unwrap() * page_size.unwrap()) as i64;

        let pictures = self
            .connection
            .prepare(format!(
                "{} ORDER BY id DESC LIMIT ?,?",
                SELECT_FROM_PICTURES
            ))
            .unwrap()
            .into_iter()
            .bind((1, offset))
            .unwrap()
            .bind((2, page_size.unwrap() as i64))
            .unwrap()
            .map(row_to_picture)
            .collect::<Vec<Picture>>();

        Ok(pictures)
    }

    async fn count_all() -> Result<i64, Error> {
        todo!()
    }

    async fn save(picture: Picture) -> Result<Picture, Error> {
        todo!()
    }
}
