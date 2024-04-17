use std::error::Error;

use serde::de::StdError;

use crate::pictures::picture_repository::ManagePictures;
use crate::pictures::resized_picture_management::{ManageResizedPictures, ResizePictureRequest};
use crate::pictures::serve_picture_files::{PictureFile, ServePictureFiles};

pub struct ResizePictureService<
    TManageResizedPictures: ManageResizedPictures,
    TManagePictures: ManagePictures,
> {
    resized_pictures_management: TManageResizedPictures,
    picture_management: TManagePictures,
}

impl<TManageResizedPictures: ManageResizedPictures, TManagePictures: ManagePictures>
    ResizePictureService<TManageResizedPictures, TManagePictures>
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

impl<TManageResizedPictures: ManageResizedPictures, TManagePictures: ManagePictures>
    ResizePictureService<TManageResizedPictures, TManagePictures>
{
    async fn get_picture_file(&self, id: i64) -> Result<Option<PictureFile>, Box<dyn StdError>> {
        let resized_picture_id = self
            .resized_pictures_management
            .find_by_request(ResizePictureRequest {
                picture_id: id,
                max_width: 400,
                max_height: 400,
            })
            .await
            .unwrap()
            .unwrap();

        let picture_info = self
            .picture_management
            .find_by_id(id)
            .await
            .unwrap()
            .unwrap();

        Ok(Some(PictureFile {
            file: self
                .resized_pictures_management
                .find_file_by_id(resized_picture_id)
                .await
                .unwrap(),
            file_name: picture_info.file_name,
            mime_type: picture_info.mime_type,
        }))
    }
}

#[cfg(test)]
mod tests {
    use async_once::AsyncOnce;
    use mockall::predicate;
    use once_cell::sync::Lazy;
    use tokio::runtime::Builder;

    use crate::pictures::picture_repository::{MockManagePictures, PartialPicture};
    use crate::pictures::resized_picture_management::{
        MockManageResizedPictures, ResizePictureRequest,
    };

    use super::*;

    mod given_a_cat_picture {
        use super::*;

        mod when_getting_the_resized_picture {
            use super::*;

            static PICTURE_SERVICE: Lazy<
                ResizePictureService<MockManageResizedPictures, MockManagePictures>,
            > = Lazy::new(|| {
                let mut resize_pictures = MockManageResizedPictures::new();
                resize_pictures
                    .expect_find_by_request()
                    .with(predicate::eq(ResizePictureRequest {
                        picture_id: 390,
                        max_width: 400,
                        max_height: 400,
                    }))
                    .returning(|_| Ok(Some(936)));

                resize_pictures
                    .expect_find_by_id()
                    .returning(|id| Ok(Some(id)));

                resize_pictures
                    .expect_find_file_by_id()
                    .with(predicate::eq(936))
                    .returning(|_| Ok(vec![220u8, (788 % 256) as u8]));

                let mut pictures = MockManagePictures::new();
                pictures
                    .expect_find_by_id()
                    .with(predicate::eq(390))
                    .returning(|id| {
                        Ok(Some(PartialPicture {
                            id,
                            mime_type: "941c3qkaS5".to_string(),
                            cat_employee_id: 10,
                            file_name: "hcjCmiqvAHB".to_string(),
                        }))
                    });

                ResizePictureService::new(resize_pictures, pictures)
            });

            lazy_static! {
                static ref PICTURE_FILE: AsyncOnce<PictureFile> = AsyncOnce::new(async {
                    PICTURE_SERVICE
                        .get_picture_file(390)
                        .await
                        .unwrap()
                        .unwrap()
                });
            }

            #[test]
            fn then_the_picture_is_correct() {
                let rt = Builder::new_current_thread().build().unwrap();
                rt.block_on(async {
                    let picture_file = PICTURE_FILE.get().await;
                    assert_eq!(picture_file.file, vec![220u8, (788 % 256) as u8])
                });
            }

            #[test]
            fn then_the_picture_file_name_is_correct() {
                let rt = Builder::new_current_thread().build().unwrap();
                rt.block_on(async {
                    let picture_file = PICTURE_FILE.get().await;
                    assert_eq!(picture_file.file_name, "hcjCmiqvAHB")
                });
            }

            #[test]
            fn then_the_picture_mime_type_is_correct() {
                let rt = Builder::new_current_thread().build().unwrap();
                rt.block_on(async {
                    let picture_file = PICTURE_FILE.get().await;
                    assert_eq!(picture_file.mime_type, "941c3qkaS5")
                });
            }
        }
    }
}
