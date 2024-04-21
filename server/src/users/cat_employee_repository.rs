use mockall::automock;
use sqlx::{Pool, Sqlite};
use warp::hyper::body::HttpBody;

use crate::errors::DataAccessError::DataAccessError;
use crate::errors::DataAccessResult;

#[derive(Clone, Debug, PartialEq, sqlx::FromRow)]
pub struct CatEmployee {
    pub id: i64,
    pub email: String,
    pub password: String,
    pub is_enabled: bool,
}

#[automock]
pub trait ManageCatEmployees {
    async fn find_by_email(&self, email: String) -> DataAccessResult<Option<CatEmployee>>;

    async fn save(&self, cat_employee: CatEmployee) -> DataAccessResult<CatEmployee>;
}

#[derive(Clone)]
pub struct CatEmployeeRepository {
    connection: Pool<Sqlite>,
}

impl CatEmployeeRepository {
    pub fn new(connection: Pool<Sqlite>) -> Self {
        Self { connection }
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
        sqlx::query_as::<_, CatEmployee>(&format!("{SELECT_FROM_CAT_EMPLOYEES} WHERE email = $1"))
            .bind(email)
            .fetch_optional(&self.connection)
            .await
            .map_err(DataAccessError)
    }

    async fn save(&self, cat_employee: CatEmployee) -> DataAccessResult<CatEmployee> {
        todo!()
    }
}
