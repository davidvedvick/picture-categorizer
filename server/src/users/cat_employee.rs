#[derive(Clone, Debug, PartialEq)]
pub struct CatEmployee {
    pub id: i64,
    pub email: String,
    pub password: String,
    pub is_enabled: bool,
}
