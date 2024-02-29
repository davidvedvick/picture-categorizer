use crate::page::Page;
use crate::pictures::manage_pictures::ManagePictures;
use crate::pictures::picture_file::PictureFile;
use crate::pictures::picture_information::PictureInformation;
use crate::pictures::picture_repository::PictureRepository;
use crate::pictures::serve_pictures::{ServePictureFiles, ServePictureInformation};
use crate::users::email_identified_cat_employee::EmailIdentifiedCatEmployee;

pub struct PictureService {
    picture_repository: PictureRepository,
}

impl PictureService {
    pub fn new(picture_repository: PictureRepository) -> Self {
        Self { picture_repository }
    }
}

impl ServePictureInformation for PictureService {
    async fn get_picture_information(
        &self,
        page_number: Option<i32>,
        page_size: Option<i32>,
    ) -> Page<PictureInformation> {
        let pictures = self
            .picture_repository
            .find_all(page_number, page_size)
            .await
            .unwrap();

        Page {
            content: pictures
                .iter()
                .map(|p| PictureInformation {
                    id: p.id,
                    file_name: p.file_name.to_string(),
                    cat_employee_id: p.cat_employee_id,
                })
                .collect(),
            number: page_number.unwrap_or(0),
            last: false,
        }
    }

    async fn add_picture(
        &self,
        picture_file: PictureFile,
        authenticated_cat_employee: EmailIdentifiedCatEmployee,
    ) -> PictureInformation {
        todo!()
    }
}

impl ServePictureFiles for PictureService {
    async fn get_picture_file(&self, id: i64) -> Option<PictureFile> {
        let picture = self.picture_repository.find_by_id(id).await.unwrap()?;
        let picture_file = self.picture_repository.find_file_by_id(id).await.unwrap()?;

        Some(PictureFile {
            file_name: picture.file_name,
            file: picture_file,
            mime_type: picture.mime_type,
        })
    }
}
