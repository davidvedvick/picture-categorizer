use crate::pictures::picture::Picture;
use super::picture;

pub trait ManagePictures {
    async fn find_by_id(&self, id: i64) -> Result<Option<Picture>, warp::Error>;

    async fn find_file_by_id(id: u64) -> Option<Result<Vec<u8>, warp::Error>>;

    async fn find_by_cat_employee_id_and_file_name(cat_employee_id: u64, file_name: String) -> Option<Result<Picture, warp::Error>>;

    async fn find_all(page_number: u32, page_size: u32) -> Option<Result<Vec<Picture>, warp::Error>>;

    async fn count_all() -> Result<u64, warp::Error>;

    async fn save(picture: Picture) -> Result<Picture, warp::Error>;
}