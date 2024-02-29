use serde::Serialize;

#[derive(Serialize)]
pub struct  PictureInformation {
    pub id: i64,
    pub(crate) cat_employee_id: i64,
    pub(crate) file_name: String,
}