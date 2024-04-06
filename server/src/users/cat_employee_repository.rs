use sqlite::{ConnectionThreadSafe, Row};

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

fn row_to_employee(row: Result<Row, impl std::fmt::Debug>) -> CatEmployee {
    let result = row.unwrap();
    CatEmployee {
        id: result.read::<i64, _>("id"),
        email: result.read::<&str, _>("email").to_string(),
        password: result.read::<&str, _>("password").to_string(),
        is_enabled: result.read::<bool, _>("is_enabled"),
    }
}

const SELECT_FROM_CAT_EMPLOYEES: &str = "
SELECT
id as id,
email as email,
password as password,
is_enabled as is_enabled
FROM cat_employee";

impl ManageCatEmployees for CatEmployeeRepository {
    async fn find_by_email(&self, email: String) -> DataAccessResult<Option<CatEmployee>> {
        let employee_option = self
            .connection
            .prepare(format!("{} WHERE email = ?", SELECT_FROM_CAT_EMPLOYEES).as_str())?
            .into_iter()
            .bind((1, email.as_str()))?
            .map(row_to_employee)
            .next();

        Ok(employee_option)
    }

    async fn save(&self, cat_employee: CatEmployee) -> DataAccessResult<CatEmployee> {
        todo!()
    }
}
