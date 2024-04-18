use std::error::Error;

use serde::de::StdError;

use crate::pictures::picture_repository::ManagePictures;
use crate::pictures::resizing::resize_pictures::ResizePictures;
use crate::pictures::resizing::resized_picture_management::{
    ManageResizedPictures, ResizePictureRequest,
};
use crate::pictures::serve_picture_files::{PictureFile, ServePictureFiles};

pub struct ResizePictureService<
    TManageResizedPictures: ManageResizedPictures,
    TManagePictures: ManagePictures,
    TResizePictures: ResizePictures,
> {
    resized_pictures_management: TManageResizedPictures,
    picture_management: TManagePictures,
    resize_pictures: TResizePictures,
}

impl<
        TManageResizedPictures: ManageResizedPictures,
        TManagePictures: ManagePictures,
        TResizePictures: ResizePictures,
    > ResizePictureService<TManageResizedPictures, TManagePictures, TResizePictures>
{
    pub fn new(
        resized_pictures_management: TManageResizedPictures,
        picture_management: TManagePictures,
        resize_pictures: TResizePictures,
    ) -> Self {
        Self {
            resized_pictures_management,
            picture_management,
            resize_pictures,
        }
    }
}

impl<
        TManageResizedPictures: ManageResizedPictures,
        TManagePictures: ManagePictures,
        TResizePictures: ResizePictures,
    > ServePictureFiles
    for ResizePictureService<TManageResizedPictures, TManagePictures, TResizePictures>
{
    async fn get_picture_file(&self, id: i64) -> Result<Option<PictureFile>, Box<dyn StdError>> {
        let picture_info = match self.picture_management.find_by_id(id).await? {
            Some(i) => i,
            None => return Ok(None),
        };

        let resize_picture_request = ResizePictureRequest {
            picture_id: id,
            max_width: 400,
            max_height: 400,
        };

        let mut resized_picture_id = self
            .resized_pictures_management
            .find_by_request(resize_picture_request)
            .await?;

        if resized_picture_id.is_none() {
            resized_picture_id = self.resize_pictures.resize(resize_picture_request).await?;
            if resized_picture_id.is_none() {
                return Ok(None);
            }
        }

        Ok(Some(PictureFile {
            file: self
                .resized_pictures_management
                .find_file_by_id(resized_picture_id.unwrap())
                .await?,
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
    use crate::pictures::resizing::resize_pictures::MockResizePictures;
    use crate::pictures::resizing::resized_picture_management::{
        MockManageResizedPictures, ResizePictureRequest,
    };

    use super::*;

    mod given_a_missing_cat_picture {
        use super::*;

        mod when_getting_the_resized_picture {
            use super::*;

            static PICTURE_SERVICE: Lazy<
                ResizePictureService<
                    MockManageResizedPictures,
                    MockManagePictures,
                    MockResizePictures,
                >,
            > = Lazy::new(|| {
                let mut resize_pictures_management = MockManageResizedPictures::new();
                resize_pictures_management
                    .expect_find_by_request()
                    .returning(|_| Ok(None));

                resize_pictures_management
                    .expect_find_by_id()
                    .returning(|id| Ok(Some(id)));

                resize_pictures_management
                    .expect_find_file_by_id()
                    .returning(|_| Ok(Vec::new()));

                let mut pictures = MockManagePictures::new();
                pictures.expect_find_by_id().returning(|id| Ok(None));

                ResizePictureService::new(
                    resize_pictures_management,
                    pictures,
                    MockResizePictures::new(),
                )
            });

            lazy_static! {
                static ref PICTURE_FILE: AsyncOnce<Option<PictureFile>> =
                    AsyncOnce::new(async { PICTURE_SERVICE.get_picture_file(390).await.unwrap() });
            }

            #[test]
            fn then_the_picture_is_correct() {
                let rt = Builder::new_current_thread().build().unwrap();
                rt.block_on(async {
                    let picture_file = PICTURE_FILE.get().await;
                    assert!(matches!(picture_file, None))
                });
            }
        }
    }

    mod given_a_cat_picture {
        use super::*;

        mod when_getting_the_resized_picture {
            use super::*;

            static PICTURE_SERVICE: Lazy<
                ResizePictureService<
                    MockManageResizedPictures,
                    MockManagePictures,
                    MockResizePictures,
                >,
            > = Lazy::new(|| {
                let mut resize_pictures_management = MockManageResizedPictures::new();
                resize_pictures_management
                    .expect_find_by_request()
                    .with(predicate::eq(ResizePictureRequest {
                        picture_id: 390,
                        max_width: 400,
                        max_height: 400,
                    }))
                    .returning(|_| Ok(Some(936)));

                resize_pictures_management
                    .expect_find_by_id()
                    .returning(|id| Ok(Some(id)));

                resize_pictures_management
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

                ResizePictureService::new(
                    resize_pictures_management,
                    pictures,
                    MockResizePictures::new(),
                )
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

        mod and_the_resized_picture_does_not_exist {
            use super::*;

            mod when_getting_the_resized_picture {
                use super::*;

                static PICTURE_SERVICE: Lazy<
                    ResizePictureService<
                        MockManageResizedPictures,
                        MockManagePictures,
                        MockResizePictures,
                    >,
                > = Lazy::new(|| {
                    let mut resize_pictures = MockManageResizedPictures::new();
                    resize_pictures
                        .expect_find_by_request()
                        .returning(|_| Ok(None));

                    resize_pictures
                        .expect_find_by_id()
                        .returning(|id| Ok(Some(id)));

                    resize_pictures
                        .expect_find_file_by_id()
                        .with(predicate::eq(691))
                        .returning(|_| Ok(vec![(659 % 256) as u8, (565 % 256) as u8, 2]));

                    let mut pictures = MockManagePictures::new();
                    pictures
                        .expect_find_by_id()
                        .with(predicate::eq(899))
                        .returning(|id| {
                            Ok(Some(PartialPicture {
                                id,
                                mime_type: "H0gF2aczmK8".to_string(),
                                cat_employee_id: 255,
                                file_name: "kFscpbuGh6".to_string(),
                            }))
                        });

                    let mut picture_resizer = MockResizePictures::new();
                    picture_resizer
                        .expect_resize()
                        .with(predicate::eq(ResizePictureRequest {
                            picture_id: 899,
                            max_height: 400,
                            max_width: 400,
                        }))
                        .returning(|r| Ok(Some(691)));

                    ResizePictureService::new(resize_pictures, pictures, picture_resizer)
                });

                lazy_static! {
                    static ref PICTURE_FILE: AsyncOnce<PictureFile> = AsyncOnce::new(async {
                        PICTURE_SERVICE
                            .get_picture_file(899)
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
                        assert_eq!(
                            picture_file.file,
                            vec![(659 % 256) as u8, (565 % 256) as u8, 2]
                        )
                    });
                }

                #[test]
                fn then_the_picture_file_name_is_correct() {
                    let rt = Builder::new_current_thread().build().unwrap();
                    rt.block_on(async {
                        let picture_file = PICTURE_FILE.get().await;
                        assert_eq!(picture_file.file_name, "kFscpbuGh6")
                    });
                }

                #[test]
                fn then_the_picture_mime_type_is_correct() {
                    let rt = Builder::new_current_thread().build().unwrap();
                    rt.block_on(async {
                        let picture_file = PICTURE_FILE.get().await;
                        assert_eq!(picture_file.mime_type, "H0gF2aczmK8")
                    });
                }
            }
        }
    }
}
