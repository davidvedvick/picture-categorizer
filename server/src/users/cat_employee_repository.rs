use sqlite::ConnectionThreadSafe;

use crate::errors::DataAccessResult;
use crate::users::cat_employee::CatEmployee;
use crate::users::manage_cat_employees::ManageCatEmployees;

pub struct CatEmployeeRepository {
    connection: ConnectionThreadSafe,
}

impl CatEmployeeRepository {
    pub fn new(connection: ConnectionThreadSafe) -> Self {
        Self { connection }
    }
}

unsafe impl Sync for CatEmployeeRepository {}

impl ManageCatEmployees for CatEmployeeRepository {
    async fn find_by_email(&self, email: String) -> DataAccessResult<Option<CatEmployee>> {
        todo!()
    }

    async fn save(&self, cat_employee: CatEmployee) -> DataAccessResult<CatEmployee> {
        todo!()
    }
}
