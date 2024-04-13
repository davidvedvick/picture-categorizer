use mockall::automock;

#[automock]
pub trait TextEncoder {
    async fn encode(&self, raw_password: String) -> String;

    async fn matches(&self, raw_password: String, encoded_password: String) -> bool;
}
