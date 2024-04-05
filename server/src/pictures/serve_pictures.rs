use crate::page::Page;
use crate::pictures::picture_file::PictureFile;
use crate::pictures::picture_information::PictureInformation;
use crate::users::email_identified_cat_employee::EmailIdentifiedCatEmployee;

pub trait ServePictureInformation {
    async fn get_picture_information(
        &self,
        page_number: Option<i32>,
        page_size: Option<i32>,
    ) -> Result<Page<PictureInformation>, impl std::fmt::Debug>;

    async fn add_picture(
        &self,
        picture_file: PictureFile,
        authenticated_cat_employee: EmailIdentifiedCatEmployee,
    ) -> Result<PictureInformation, impl std::fmt::Debug>;
}

pub trait ServePictureFiles {
    async fn get_picture_file(&self, id: i64) -> Result<Option<PictureFile>, impl std::fmt::Debug>;
}
