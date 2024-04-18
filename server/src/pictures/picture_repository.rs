use mockall::automock;
use sqlx::{Pool, Row, Sqlite};

use crate::errors::DataAccessError::DataAccessError;
use crate::errors::DataAccessResult;

#[derive(Clone, Debug, PartialEq, sqlx::FromRow)]
pub struct Picture {
    pub id: i64,
    pub file_name: String,
    pub cat_employee_id: i64,
    pub file: Vec<u8>,
    pub mime_type: String,
}

#[derive(Clone, Debug, PartialEq, sqlx::FromRow)]
pub struct PartialPicture {
    pub id: i64,
    pub file_name: String,
    pub cat_employee_id: i64,
    pub mime_type: String,
}

#[automock]
pub trait ManagePictures {
    async fn find_by_id(&self, id: i64) -> DataAccessResult<Option<PartialPicture>>;

    async fn find_file_by_id(&self, id: i64) -> DataAccessResult<Vec<u8>>;

    async fn find_by_cat_employee_id_and_file_name(
        &self,
        cat_employee_id: i64,
        file_name: String,
    ) -> DataAccessResult<Option<PartialPicture>>;

    async fn find_all(
        &self,
        page_number: Option<i32>,
        page_size: Option<i32>,
    ) -> DataAccessResult<Vec<PartialPicture>>;

    async fn count_all(&self) -> DataAccessResult<i64>;

    async fn save(&self, picture: Picture) -> DataAccessResult<Picture>;
}

#[derive(Clone)]
pub struct PictureRepository {
    connection: Pool<Sqlite>,
}

impl PictureRepository {
    pub fn new(connection: Pool<Sqlite>) -> Self {
        Self { connection }
    }
}

unsafe impl Sync for PictureRepository {}

const SELECT_FROM_PICTURES: &str = "
SELECT
id,
cat_employee_id,
file_name,
mime_type
FROM picture
";

impl ManagePictures for PictureRepository {
    async fn find_by_id(&self, id: i64) -> DataAccessResult<Option<PartialPicture>> {
        sqlx::query_as::<_, PartialPicture>(&format!("{SELECT_FROM_PICTURES} WHERE id = $1"))
            .bind(id)
            .fetch_optional(&self.connection)
            .await
            .map_err(DataAccessError)
    }

    async fn find_file_by_id(&self, id: i64) -> DataAccessResult<Vec<u8>> {
        let result = sqlx::query("SELECT file FROM picture WHERE id = $1")
            .bind(id)
            .fetch_optional(&self.connection)
            .await
            .map_err(DataAccessError)?;

        match result {
            Some(r) => Ok(r.try_get("file").map_err(DataAccessError)?),
            None => Ok(Vec::new()),
        }
    }

    async fn find_by_cat_employee_id_and_file_name(
        &self,
        cat_employee_id: i64,
        file_name: String,
    ) -> DataAccessResult<Option<PartialPicture>> {
        todo!()
    }

    async fn find_all(
        &self,
        page_number: Option<i32>,
        page_size: Option<i32>,
    ) -> DataAccessResult<Vec<PartialPicture>> {
        if page_number == None || page_size == None {
            let pictures = sqlx::query_as::<_, PartialPicture>(SELECT_FROM_PICTURES)
                .fetch_all(&self.connection)
                .await
                .map_err(DataAccessError)?;

            return Ok(pictures);
        }

        let offset: i64 = (page_number.unwrap() * page_size.unwrap()) as i64;

        let pictures = sqlx::query_as::<_, PartialPicture>(&format!(
            "{SELECT_FROM_PICTURES} ORDER BY id DESC LIMIT ?,?"
        ))
        .bind(offset)
        .bind(page_size.unwrap() as i64)
        .fetch_all(&self.connection)
        .await
        .map_err(DataAccessError)?;

        Ok(pictures)
    }

    async fn count_all(&self) -> DataAccessResult<i64> {
        sqlx::query("SELECT COUNT(*) FROM picture")
            .fetch_one(&self.connection)
            .await
            .map_err(DataAccessError)?
            .try_get::<i64, _>(0)
            .map_err(DataAccessError)
    }

    async fn save(&self, picture: Picture) -> DataAccessResult<Picture> {
        let query = sqlx::query(
            "INSERT INTO picture (cat_employee_id, file_name, file, mime_type)
             VALUES ($1, $2, $3, $4)",
        );

        let result = query
            .bind(picture.cat_employee_id)
            .bind(picture.file_name.to_string())
            .bind(picture.file.clone())
            .bind(picture.mime_type.to_string())
            .execute(&self.connection)
            .await
            .map_err(DataAccessError)?;

        Ok(Picture {
            id: result.last_insert_rowid(),
            file_name: picture.file_name.to_string(),
            cat_employee_id: picture.cat_employee_id,
            file: picture.file.clone(),
            mime_type: picture.mime_type.to_string(),
        })
    }
}
