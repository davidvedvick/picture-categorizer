use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PictureFile {
    pub file_name: String,
    pub file: Vec<u8>,
    pub mime_type: String,
}
