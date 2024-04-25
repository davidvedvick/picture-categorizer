use std::fmt::Debug;

use mockall::automock;
use sqlx::{Pool, Row, Sqlite};

use crate::errors::{DataAccessError, DataAccessResult};

#[derive(PartialEq, Debug, Clone, Copy)]
pub struct ResizePictureRequest {
    pub picture_id: i64,
    pub max_width: u32,
    pub max_height: u32,
}

pub type ResizedPictureId = i64;

#[derive(sqlx::FromRow)]
pub struct ResizedPicture<'a> {
    pub picture_id: i64,
    pub max_width: u32,
    pub max_height: u32,
    pub file: &'a [u8],
}

const SELECT_RESIZED_PICTURE_IDS: &str = "
SELECT id as id
FROM resized_picture
";

#[automock]
pub trait ManageResizedPictures {
    async fn find_by_request(
        &self,
        resize_picture_request: ResizePictureRequest,
    ) -> DataAccessResult<Option<ResizedPictureId>>;

    async fn find_by_id(&self, id: ResizedPictureId) -> DataAccessResult<Option<ResizedPictureId>>;

    async fn find_file_by_id(&self, id: ResizedPictureId) -> DataAccessResult<Vec<u8>>;

    async fn save<'a>(&self, picture: &'a ResizedPicture<'a>)
        -> DataAccessResult<ResizedPictureId>;
}

#[derive(Clone)]
pub struct ResizedPictureRepository {
    pool: Pool<Sqlite>, // The SQLite database connection pool
}

impl ResizedPictureRepository {
    pub fn new(pool: Pool<Sqlite>) -> Self {
        Self { pool }
    }
}

impl ManageResizedPictures for ResizedPictureRepository {
    async fn find_by_request(
        &self,
        request: ResizePictureRequest,
    ) -> DataAccessResult<Option<ResizedPictureId>> {
        let option = sqlx::query(
            &format!("{SELECT_RESIZED_PICTURE_IDS} WHERE picture_id = $1 AND maxWidth = $2 AND maxHeight = $3"))
            .bind(request.picture_id)
            .bind(request.max_width)
            .bind(request.max_height)
            .fetch_optional(&self.pool)
            .await
            .map_err(DataAccessError::DataAccessError)?;

        Ok(match option {
            Some(r) => Some(
                r.try_get::<ResizedPictureId, _>("id")
                    .map_err(DataAccessError::DataAccessError)?,
            ),
            None => None,
        })
    }

    async fn find_by_id(&self, id: ResizedPictureId) -> DataAccessResult<Option<ResizedPictureId>> {
        let option = sqlx::query(&format!("{SELECT_RESIZED_PICTURE_IDS} WHERE id = $1"))
            .bind(id)
            .fetch_optional(&self.pool)
            .await
            .map_err(DataAccessError::DataAccessError)?;

        Ok(match option {
            Some(r) => Some(
                r.try_get::<ResizedPictureId, _>("id")
                    .map_err(DataAccessError::DataAccessError)?,
            ),
            None => None,
        })
    }

    async fn find_file_by_id(&self, id: ResizedPictureId) -> DataAccessResult<Vec<u8>> {
        let result = sqlx::query("SELECT file FROM resized_picture WHERE id = $1")
            .bind(id)
            .fetch_optional(&self.pool)
            .await
            .map_err(DataAccessError::DataAccessError)?;

        match result {
            Some(r) => Ok(r
                .try_get("file")
                .map_err(DataAccessError::DataAccessError)?),
            None => Ok(Vec::new()),
        }
    }

    async fn save<'a>(
        &self,
        picture: &'a ResizedPicture<'a>,
    ) -> DataAccessResult<ResizedPictureId> {
        let result = sqlx::query(
            "INSERT INTO resized_picture (picture_id, maxWidth, maxHeight, file) VALUES ($1, $2, $3, $4)",
        )
            .bind(picture.picture_id)
            .bind(picture.max_width)
            .bind(picture.max_height)
            .bind(picture.file)
            .execute(&self.pool)
            .await
            .map_err(DataAccessError::DataAccessError)?;

        Ok(result.last_insert_rowid())
    }
}
