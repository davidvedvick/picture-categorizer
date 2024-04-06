#[derive(Clone, Debug, PartialEq)]
pub struct Picture {
    pub id: i64,
    pub file_name: String,
    pub cat_employee_id: i64,
    pub file: Vec<u8>,
    pub mime_type: String,
}
