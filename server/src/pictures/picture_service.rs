use crate::page::Page;
use crate::pictures::manage_pictures::ManagePictures;
use crate::pictures::picture::Picture;
use crate::pictures::picture_file::PictureFile;
use crate::pictures::picture_information::PictureInformation;
use crate::pictures::serve_pictures::{ServePictureFiles, ServePictureInformation};
use crate::users::email_identified_cat_employee::EmailIdentifiedCatEmployee;
use crate::users::manage_cat_employees::ManageCatEmployees;

pub struct PictureService<TPicturesRepo: ManagePictures, TCatEmployeesRepo: ManageCatEmployees> {
    picture_repository: TPicturesRepo,
    cat_repository: TCatEmployeesRepo,
}

impl<TPicturesRepo: ManagePictures, TCatEmployeesRepo: ManageCatEmployees>
    PictureService<TPicturesRepo, TCatEmployeesRepo>
{
    pub fn new(picture_repository: TPicturesRepo, cat_repository: TCatEmployeesRepo) -> Self {
        Self {
            picture_repository,
            cat_repository,
        }
    }
}

impl<TPicturesRepo: ManagePictures, TCatEmployeesRepo: ManageCatEmployees> ServePictureInformation
    for PictureService<TPicturesRepo, TCatEmployeesRepo>
{
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
        let cat_employee = self
            .cat_repository
            .find_by_email(authenticated_cat_employee.email)
            .await;

        let added_picture = self
            .picture_repository
            .save(Picture {
                id: 0,
                file_name: picture_file.file_name,
                cat_employee_id: match cat_employee {
                    Ok(Some(emp)) => emp.id,
                    Ok(None) => {
                        return Ok(PictureInformation {
                            id: 0,
                            cat_employee_id: 0,
                            file_name: "".to_string(),
                        })
                    }
                    Err(e) => return Err(e),
                },
                file: picture_file.file,
                mime_type: picture_file.mime_type,
            })
            .await;

        return match added_picture {
            Ok(p) => Ok(PictureInformation {
                id: p.id,
                file_name: p.file_name,
                cat_employee_id: p.cat_employee_id,
            }),
            Err(e) => return Err(e),
        };
    }
}

impl<TPicturesRepo: ManagePictures, TCatEmployeesRepo: ManageCatEmployees> ServePictureFiles
    for PictureService<TPicturesRepo, TCatEmployeesRepo>
{
    async fn get_picture_file(&self, id: i64) -> Result<Option<PictureFile>, impl std::fmt::Debug> {
        let future_picture = self.picture_repository.find_file_by_id(id);

        let picture = match self.picture_repository.find_by_id(id).await {
            Ok(Some(pic)) => pic,
            Ok(None) => return Ok(None),
            Err(e) => return Err(e),
        };

        match future_picture.await {
            Ok(file) => Ok(Some(PictureFile {
                file_name: picture.file_name,
                file,
                mime_type: picture.mime_type,
            })),
            Err(e) => Err(e),
        }
    }
}

#[cfg(test)]
mod tests {
    use std::sync::Once;

    use async_once::AsyncOnce;
    use lazy_static::lazy_static;
    use mockall::predicate;
    use once_cell::sync::Lazy;
    use tokio::runtime::Builder;

    use crate::pictures::manage_pictures::MockManagePictures;
    use crate::pictures::picture::Picture;
    use crate::users::manage_cat_employees::MockManageCatEmployees;

    use super::*;

    mod given_cat_pictures {
        use super::*;

        mod when_getting_the_first_page {
            use super::*;

            static INIT: Once = Once::new();

            static PICTURE_SERVICE: Lazy<
                PictureService<MockManagePictures, MockManageCatEmployees>,
            > = Lazy::new(|| {
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

                PictureService::new(mock, MockManageCatEmployees::new())
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
            fn then_the_pictures_are_correct() {
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
            use super::*;

            static INIT: Once = Once::new();

            static PICTURE_SERVICE: Lazy<
                PictureService<MockManagePictures, MockManageCatEmployees>,
            > = Lazy::new(|| {
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

                PictureService::new(mock, MockManageCatEmployees::new())
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

        mod when_getting_all_picture_information {
            use super::*;

            static INIT: Once = Once::new();

            static PICTURE_SERVICE: Lazy<
                PictureService<MockManagePictures, MockManageCatEmployees>,
            > = Lazy::new(|| {
                let mut mock = MockManagePictures::new();
                mock.expect_find_all()
                    .with(predicate::eq(None), predicate::eq(None))
                    .returning(|n, s| {
                        Ok(vec![
                            Picture {
                                id: 892,
                                file_name: "2onzuNJ".to_string(),
                                cat_employee_id: 445,
                                file: vec![],
                                mime_type: "".to_string(),
                            },
                            Picture {
                                id: 895,
                                cat_employee_id: 35,
                                file_name: "dlg0fWB".to_string(),
                                file: vec![],
                                mime_type: "".to_string(),
                            },
                            Picture {
                                id: 69,
                                cat_employee_id: 398,
                                file_name: "qm4ZjAGAgb".to_string(),
                                file: vec![],
                                mime_type: "".to_string(),
                            },
                        ])
                    });

                mock.expect_count_all().returning(|| Ok(-127i64));

                PictureService::new(mock, MockManageCatEmployees::new())
            });

            lazy_static! {
                static ref PICTURE_INFO: AsyncOnce<Page<PictureInformation>> =
                    AsyncOnce::new(async {
                        PICTURE_SERVICE
                            .get_picture_information(None, None)
                            .await
                            .unwrap()
                    });
            }

            #[test]
            fn then_the_pictures_are_correct() {
                let rt = Builder::new_current_thread().build().unwrap();
                rt.block_on(async {
                    let page = PICTURE_INFO.get().await;
                    assert_eq!(
                        page.content,
                        vec![
                            PictureInformation {
                                id: 892,
                                file_name: "2onzuNJ".to_string(),
                                cat_employee_id: 445,
                            },
                            PictureInformation {
                                id: 895,
                                cat_employee_id: 35,
                                file_name: "dlg0fWB".to_string(),
                            },
                            PictureInformation {
                                id: 69,
                                cat_employee_id: 398,
                                file_name: "qm4ZjAGAgb".to_string(),
                            },
                        ]
                    );
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
                    assert_eq!(page.number, 0)
                });
            }
        }

        mod when_getting_a_picture {
            use super::*;

            static INIT: Once = Once::new();

            static PICTURE_SERVICE: Lazy<
                PictureService<MockManagePictures, MockManageCatEmployees>,
            > = Lazy::new(|| {
                let mut mock = MockManagePictures::new();

                mock.expect_find_by_id()
                    .with(predicate::eq(644))
                    .returning(|id| {
                        Ok(Some(Picture {
                            id: 644,
                            mime_type: "zXHTufH".to_string(),
                            cat_employee_id: 99,
                            file_name: "9ZVugNotp".to_string(),
                            file: vec![],
                        }))
                    });

                mock.expect_find_file_by_id()
                    .with(predicate::eq(644))
                    .returning(|id| {
                        Ok(vec![
                            (322 % 128) as u8,
                            (379 % 128) as u8,
                            (706 % 128) as u8,
                        ])
                    });

                mock.expect_count_all().returning(|| Ok(-127i64));

                PictureService::new(mock, MockManageCatEmployees::new())
            });

            lazy_static! {
                static ref PICTURE_FILE: AsyncOnce<PictureFile> = AsyncOnce::new(async {
                    PICTURE_SERVICE
                        .get_picture_file(644)
                        .await
                        .unwrap()
                        .unwrap()
                });
            }

            #[test]
            fn then_the_picture_is_correct() {
                let rt = Builder::new_current_thread().build().unwrap();
                rt.block_on(async {
                    let page = PICTURE_FILE.get().await;
                    assert_eq!(
                        page.file,
                        vec![(322 % 128) as u8, (379 % 128) as u8, (706 % 128) as u8]
                    )
                });
            }
        }
    }

    mod given_a_user {
        use super::*;

        mod when_adding_the_users_pictures {
            use std::sync::Mutex;

            use crate::users::cat_employee::CatEmployee;

            use super::*;

            static PICTURE_SERVICE: Lazy<
                PictureService<MockManagePictures, MockManageCatEmployees>,
            > = Lazy::new(|| {
                let mut mock = MockManagePictures::new();

                mock.expect_find_by_cat_employee_id_and_file_name()
                    .returning(|e, f| Ok(None));

                mock.expect_save().returning(|p| {
                    PICTURES.lock().unwrap().push(p.clone());

                    Ok(p)
                });

                mock.expect_count_all().returning(|| Ok(-127i64));

                let mut employee_mock = MockManageCatEmployees::new();
                employee_mock
                    .expect_find_by_email()
                    .with(predicate::eq("8N8k".to_string()))
                    .returning(|e| {
                        Ok(Some(CatEmployee {
                            id: 920,
                            password: "OaH1Su".to_string(),
                            is_enabled: true,
                            email: e,
                        }))
                    });

                PictureService::new(mock, employee_mock)
            });

            lazy_static! {
                static ref PICTURES: Mutex<Vec<Picture>> = Mutex::new(Vec::new());
                static ref ADDED_PICTURE: AsyncOnce<PictureInformation> = AsyncOnce::new(async {
                    PICTURE_SERVICE
                        .add_picture(
                            PictureFile {
                                file_name: "KEDSlros".to_string(),
                                file: vec![247, (761 % 256) as u8, (879 % 256) as u8, 11],
                                mime_type: "pV9UkazC".to_string(),
                            },
                            EmailIdentifiedCatEmployee {
                                email: "8N8k".to_string(),
                            },
                        )
                        .await
                        .unwrap()
                });
            }

            #[test]
            fn then_the_added_pictures_are_correct() {
                let rt = Builder::new_current_thread().build().unwrap();
                rt.block_on(async {
                    let picture = ADDED_PICTURE.get().await;
                    assert_eq!(
                        *picture,
                        PictureInformation {
                            id: 0,
                            cat_employee_id: 920,
                            file_name: "KEDSlros".to_string(),
                        }
                    )
                });
            }

            #[test]
            fn then_the_response_data_is_correct() {
                let rt = Builder::new_current_thread().build().unwrap();
                rt.block_on(async {
                    ADDED_PICTURE.get().await;
                    let pictures = PICTURES.lock().unwrap().clone();
                    assert_eq!(
                        pictures,
                        vec![Picture {
                            id: 0,
                            file_name: "KEDSlros".to_string(),
                            cat_employee_id: 920,
                            file: vec![247, (761 % 256) as u8, (879 % 256) as u8, 11],
                            mime_type: "pV9UkazC".to_string(),
                        }]
                    )
                });
            }
        }
    }
}
