use serde::Deserialize;

use crate::connection_config::ConnectionConfiguration;
use crate::security::jwt_token_management::AuthenticationConfiguration;
use crate::security::text_encoder::EncoderConfig;

#[derive(Deserialize)]
pub struct SecurityConfiguration {
    pub encoder: EncoderConfig,

    #[serde(default = "default_well_known_location")]
    pub well_known_location: Option<String>,
}

fn default_well_known_location() -> Option<String> {
    None
}

#[derive(Deserialize)]
pub struct AppConfig {
    pub authentication: AuthenticationConfiguration,
    pub db: ConnectionConfiguration,
    pub security: SecurityConfiguration,
}
