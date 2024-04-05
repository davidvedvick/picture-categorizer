use mockall::automock;

use crate::errors::DataAccessResult;
use crate::pictures::picture::Picture;

#[automock]
pub trait ManagePictures {
    async fn find_by_id(&self, id: i64) -> DataAccessResult<Option<Picture>>;

    async fn find_file_by_id(&self, id: i64) -> DataAccessResult<Vec<u8>>;

    async fn find_by_cat_employee_id_and_file_name(
        &self,
        cat_employee_id: i64,
        file_name: String,
    ) -> DataAccessResult<Option<Picture>>;

    async fn find_all(
        &self,
        page_number: Option<i32>,
        page_size: Option<i32>,
    ) -> DataAccessResult<Vec<Picture>>;

    async fn count_all(&self) -> DataAccessResult<i64>;

    async fn save(&self, picture: Picture) -> DataAccessResult<Picture>;
}
