use crate::pictures::picture::Picture;

pub trait ManagePictures {
    async fn find_by_id(&self, id: i64) -> Result<Option<Picture>, warp::Error>;

    async fn find_file_by_id(&self, id: i64) -> Result<Option<Vec<u8>>, warp::Error>;

    async fn find_by_cat_employee_id_and_file_name(
        cat_employee_id: i64,
        file_name: String,
    ) -> Result<Option<Picture>, warp::Error>;

    async fn find_all(
        &self,
        page_number: Option<i32>,
        page_size: Option<i32>,
    ) -> Result<Vec<Picture>, warp::Error>;

    async fn count_all() -> Result<i64, warp::Error>;

    async fn save(picture: Picture) -> Result<Picture, warp::Error>;
}
