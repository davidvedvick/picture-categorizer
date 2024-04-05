use crate::page::Page;
use crate::pictures::manage_pictures::ManagePictures;
use crate::pictures::picture_file::PictureFile;
use crate::pictures::picture_information::PictureInformation;
use crate::pictures::serve_pictures::{ServePictureFiles, ServePictureInformation};
use crate::users::email_identified_cat_employee::EmailIdentifiedCatEmployee;

pub struct PictureService<TRepo: ManagePictures> {
    picture_repository: TRepo,
}

impl<TRepo: ManagePictures> PictureService<TRepo> {
    pub fn new(picture_repository: TRepo) -> Self {
        Self { picture_repository }
    }
}

impl<TRepo: ManagePictures> ServePictureInformation for PictureService<TRepo> {
    async fn get_picture_information(
        &self,
        page_number: Option<i32>,
        page_size: Option<i32>,
    ) -> Result<Page<PictureInformation>, impl std::fmt::Debug> {
        let future_pictures = self.picture_repository.find_all(page_number, page_size);

        let is_last = match (page_number, page_size) {
            (Some(n), Some(s)) => match self.picture_repository.count_all().await {
                Ok(count) => count <= ((n + 1) * s) as i64,
                Err(e) => return Err(e),
            },
            _ => true,
        };

        match future_pictures.await {
            Ok(pictures) => Ok(Page {
                content: pictures
                    .iter()
                    .map(|p| PictureInformation {
                        id: p.id,
                        file_name: p.file_name.to_string(),
                        cat_employee_id: p.cat_employee_id,
                    })
                    .collect(),
                number: page_number.unwrap_or(0),
                last: is_last,
            }),
            Err(e) => Err(e),
        }
    }

    async fn add_picture(
        &self,
        picture_file: PictureFile,
        authenticated_cat_employee: EmailIdentifiedCatEmployee,
    ) -> Result<PictureInformation, impl std::fmt::Debug> {
        Err("todo")
    }
}

impl<TRepo: ManagePictures> ServePictureFiles for PictureService<TRepo> {
    async fn get_picture_file(&self, id: i64) -> Result<Option<PictureFile>, impl std::fmt::Debug> {
        let future_picture = self.picture_repository.find_file_by_id(id);

        let picture = match self.picture_repository.find_by_id(id).await {
            Ok(Some(pic)) => pic,
            Ok(None) => return Ok(None),
            Err(e) => return Err(e),
        };

        match future_picture.await {
            Ok(Some(file)) => Ok(Some(PictureFile {
                file_name: picture.file_name,
                file,
                mime_type: picture.mime_type,
            })),
            Ok(None) => Ok(None),
            Err(e) => Err(e),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    mod given_a_user {
        use super::*;

        mod when_adding_the_users_pictures {
            use std::sync::Once;

            use async_once::AsyncOnce;
            use lazy_static::lazy_static;
            use mockall::predicate;
            use once_cell::sync::Lazy;
            use tokio::runtime::Builder;

            use crate::pictures::manage_pictures::MockManagePictures;
            use crate::pictures::picture::Picture;

            use super::*;

            static INIT: Once = Once::new();

            static PICTURE_SERVICE: Lazy<PictureService<MockManagePictures>> = Lazy::new(|| {
                let mut mock = MockManagePictures::new();
                mock.expect_find_all()
                    .with(predicate::eq(Some(0)), predicate::eq(Some(5)))
                    .returning(|n, s| {
                        Ok(vec![
                            Picture {
                                id: 823,
                                file_name: "xKLbRIuf".to_string(),
                                cat_employee_id: 521,
                                file: vec![],
                                mime_type: "".to_string(),
                            },
                            Picture {
                                id: 437,
                                cat_employee_id: 521,
                                file_name: "jwKJ996Yo".to_string(),
                                file: vec![],
                                mime_type: "".to_string(),
                            },
                        ])
                    });

                mock.expect_count_all().returning(|| Ok(10i64));

                PictureService::new(mock)
            });

            lazy_static! {
                static ref PICTURE_INFO: AsyncOnce<Page<PictureInformation>> =
                    AsyncOnce::new(async {
                        PICTURE_SERVICE
                            .get_picture_information(Some(0), Some(5))
                            .await
                            .unwrap()
                    });
            }

            #[test]
            fn then_the_added_pictures_are_correct() {
                let rt = Builder::new_current_thread().build().unwrap();
                rt.block_on(async {
                    let page = PICTURE_INFO.get().await;
                    assert_eq!(
                        page.content,
                        vec![
                            PictureInformation {
                                id: 823,
                                file_name: "xKLbRIuf".to_string(),
                                cat_employee_id: 521,
                            },
                            PictureInformation {
                                id: 437,
                                cat_employee_id: 521,
                                file_name: "jwKJ996Yo".to_string(),
                            }
                        ]
                    );
                });
            }

            #[test]
            fn then_it_is_not_the_last_page() {
                let rt = Builder::new_current_thread().build().unwrap();
                rt.block_on(async {
                    let page = PICTURE_INFO.get().await;
                    assert_eq!(page.last, false)
                });
            }

            #[test]
            fn then_it_is_the_correct_page_number() {
                let rt = Builder::new_current_thread().build().unwrap();
                rt.block_on(async {
                    let page = PICTURE_INFO.get().await;
                    assert_eq!(page.number, 0)
                });
            }
        }

        mod when_getting_the_last_page {
            use std::sync::Once;

            use async_once::AsyncOnce;
            use lazy_static::lazy_static;
            use mockall::predicate;
            use once_cell::sync::Lazy;
            use tokio::runtime::Builder;

            use crate::pictures::manage_pictures::MockManagePictures;
            use crate::pictures::picture::Picture;

            use super::*;

            static INIT: Once = Once::new();

            static PICTURE_SERVICE: Lazy<PictureService<MockManagePictures>> = Lazy::new(|| {
                let mut mock = MockManagePictures::new();
                mock.expect_find_all()
                    .with(predicate::eq(Some(1)), predicate::eq(Some(3)))
                    .returning(|n, s| {
                        Ok(vec![Picture {
                            id: 0,
                            cat_employee_id: 0,
                            file_name: "".to_string(),
                            file: vec![],
                            mime_type: "".to_string(),
                        }])
                    });

                mock.expect_find_all().returning(|n, s| Ok(vec![]));

                mock.expect_count_all().returning(|| Ok(6i64));

                PictureService::new(mock)
            });

            lazy_static! {
                static ref PICTURE_INFO: AsyncOnce<Page<PictureInformation>> =
                    AsyncOnce::new(async {
                        PICTURE_SERVICE
                            .get_picture_information(Some(1), Some(3))
                            .await
                            .unwrap()
                    });
            }

            #[test]
            fn then_the_added_pictures_are_correct() {
                let rt = Builder::new_current_thread().build().unwrap();
                rt.block_on(async {
                    let page = PICTURE_INFO.get().await;
                    assert_eq!(page.content.len(), 1);
                });
            }

            #[test]
            fn then_it_is_the_last_page() {
                let rt = Builder::new_current_thread().build().unwrap();
                rt.block_on(async {
                    let page = PICTURE_INFO.get().await;
                    assert_eq!(page.last, true)
                });
            }

            #[test]
            fn then_it_is_the_correct_page_number() {
                let rt = Builder::new_current_thread().build().unwrap();
                rt.block_on(async {
                    let page = PICTURE_INFO.get().await;
                    assert_eq!(page.number, 1)
                });
            }
        }
    }
}
