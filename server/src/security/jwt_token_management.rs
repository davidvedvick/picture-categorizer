use std::time::{Duration, SystemTime, UNIX_EPOCH};

use jsonwebtoken::errors::{Error, ErrorKind};
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde::de::StdError;
use serde::{Deserialize, Serialize};
use thiserror::Error;

use crate::users::cat_employee_entry::AuthorizedCatEmployeeCredentials;
use crate::users::email_identified_cat_employee::EmailIdentifiedCatEmployee;

const BEARER: &str = "Bearer";
const EXPIRATION_DURATION_SECONDS: u32 = 86_400;

#[derive(Serialize, Deserialize, Clone)]
pub struct AuthenticationConfiguration {
    secret: String,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct JwtToken {
    cat_employee_id: i64,
    token: String,
    expires_in_ms: u64,
}

#[derive(Serialize, Deserialize, Debug)]
struct Claims {
    sub: String,
    exp: u32,
}

#[derive(Error, Debug)]
pub enum TokenDecodingError {
    #[error("token expired")]
    Expired,

    #[error("an error occurred decoding the token: {0}")]
    DecodingError(#[from] Error),

    #[error(transparent)]
    UnexpectedError(#[from] anyhow::Error),
}

pub trait ManageJwtTokens {
    async fn decode_token(
        &self,
        token: String,
    ) -> Result<EmailIdentifiedCatEmployee, TokenDecodingError>;

    async fn generate_token(
        &self,
        authenticated_employee: &AuthorizedCatEmployeeCredentials,
    ) -> Result<JwtToken, Box<dyn StdError>>;
}

#[derive(Clone)]
pub struct JwtTokenManagement {
    configuration: AuthenticationConfiguration,
}

impl JwtTokenManagement {
    pub fn new(configuration: AuthenticationConfiguration) -> Self {
        Self { configuration }
    }
}

unsafe impl Send for JwtTokenManagement {}

unsafe impl Sync for JwtTokenManagement {}

impl ManageJwtTokens for JwtTokenManagement {
    async fn decode_token(
        &self,
        token: String,
    ) -> Result<EmailIdentifiedCatEmployee, TokenDecodingError> {
        let decoded = decode::<Claims>(
            token
                .strip_prefix(BEARER)
                .unwrap_or(token.as_str())
                .trim_start(),
            &DecodingKey::from_secret(self.configuration.secret.as_ref()),
            &Validation::new(Algorithm::HS512),
        )
        .map_err(|e| match e.clone().into_kind() {
            ErrorKind::ExpiredSignature => TokenDecodingError::Expired,
            _ => TokenDecodingError::DecodingError(e),
        })?;

        Ok(EmailIdentifiedCatEmployee {
            email: decoded.claims.sub,
        })
    }

    async fn generate_token(
        &self,
        authenticated_employee: &AuthorizedCatEmployeeCredentials,
    ) -> Result<JwtToken, Box<dyn StdError>> {
        let now = SystemTime::now();
        let expiration_time = now + Duration::from_secs(EXPIRATION_DURATION_SECONDS as u64);
        let expiration_duration = expiration_time.duration_since(UNIX_EPOCH)?;

        let token = encode(
            &Header {
                alg: Algorithm::HS512,
                ..Default::default()
            },
            &Claims {
                exp: expiration_duration.as_secs() as u32,
                sub: authenticated_employee.email.to_string(),
            },
            &EncodingKey::from_secret(self.configuration.secret.as_ref()),
        )?;

        Ok(JwtToken {
            token,
            cat_employee_id: authenticated_employee.cat_employee_id,
            expires_in_ms: EXPIRATION_DURATION_SECONDS as u64 * 1000u64,
        })
    }
}
