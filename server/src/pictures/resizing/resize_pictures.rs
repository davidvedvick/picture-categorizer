use std::io::Cursor;

use image::imageops::FilterType;
use image::io::Reader;
use mockall::automock;
use serde::de::StdError;

use crate::pictures::picture_repository::ManagePictures;
use crate::pictures::resizing::resized_picture_management::{
    ManageResizedPictures, ResizePictureRequest, ResizedPicture, ResizedPictureId,
};

#[automock]
pub trait ResizePictures {
    async fn resize(
        &self,
        message: ResizePictureRequest,
    ) -> Result<Option<ResizedPictureId>, Box<dyn StdError>>;
}

pub struct ResizePictureProcessor<
    TManageResizedPictures: ManageResizedPictures,
    TManagePictures: ManagePictures,
> {
    resized_pictures_management: TManageResizedPictures,
    picture_management: TManagePictures,
}

impl<TManageResizedPictures: ManageResizedPictures, TManagePictures: ManagePictures>
    ResizePictureProcessor<TManageResizedPictures, TManagePictures>
{
    pub fn new(
        resized_pictures_management: TManageResizedPictures,
        picture_management: TManagePictures,
    ) -> Self {
        Self {
            resized_pictures_management,
            picture_management,
        }
    }
}

impl<TManageResizedPictures: ManageResizedPictures, TManagePictures: ManagePictures> ResizePictures
    for ResizePictureProcessor<TManageResizedPictures, TManagePictures>
{
    async fn resize(
        &self,
        message: ResizePictureRequest,
    ) -> Result<Option<ResizedPictureId>, Box<dyn StdError>> {
        loop {
            match self
                .resized_pictures_management
                .find_by_request(message)
                .await
            {
                Ok(Some(id)) => return Ok(Some(id)),
                Err(_) => continue,
                _ => {}
            }

            let picture_id = message.picture_id;

            let picture_file = match self.picture_management.find_file_by_id(picture_id).await {
                Ok(f) => f,
                Err(_) => continue,
            };

            let reader = Reader::new(Cursor::new(picture_file)).with_guessed_format()?;

            let format = match reader.format() {
                Some(f) => f,
                None => return Ok(None),
            };

            let new_image = reader.decode()?.resize(
                message.max_width,
                message.max_height,
                FilterType::Triangle,
            );

            let mut file_bytes: Vec<u8> = Vec::new();
            new_image.write_to(&mut Cursor::new(&mut file_bytes), format)?;

            let saved_picture_id = self
                .resized_pictures_management
                .save(&ResizedPicture {
                    max_height: message.max_height,
                    max_width: message.max_width,
                    picture_id: message.picture_id,
                    file: file_bytes,
                })
                .await;

            match saved_picture_id {
                Ok(id) => return Ok(Some(id)),
                Err(_) => continue,
            }
        }
    }
}
