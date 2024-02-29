use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Page<T> {
    pub content: Vec<T>,
    pub number: i32,
    pub last: bool,
}
