use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
pub struct ConnectionConfiguration {
    pub file: String,
}
