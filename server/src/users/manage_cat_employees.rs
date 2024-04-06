use mockall::automock;

use crate::errors::DataAccessResult;
use crate::users::cat_employee::CatEmployee;

#[automock]
pub trait ManageCatEmployees {
    async fn find_by_email(&self, email: String) -> DataAccessResult<Option<CatEmployee>>;

    async fn save(&self, cat_employee: CatEmployee) -> DataAccessResult<CatEmployee>;
}
