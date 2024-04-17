use serde::de::StdError;
use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PictureFile {
    pub file_name: String,
    pub file: Vec<u8>,
    pub mime_type: String,
}

pub trait ServePictureFiles {
    async fn get_picture_file(&self, id: i64) -> Result<Option<PictureFile>, Box<dyn StdError>>;
}
