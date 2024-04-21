use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde::de::StdError;
use serde::{Deserialize, Serialize};

use crate::users::cat_employee_entry::CatEmployeeCredentials;

const BEARER: &str = "Bearer";
const EXPIRATION_DURATION_SECONDS: u32 = 86_400;

#[derive(Serialize, Deserialize, Clone)]
pub struct AuthenticationConfiguration {
    secret: String,
}

pub struct EmailIdentifiedCatEmployee {
    email: String,
}

#[derive(Serialize, Deserialize, Clone)]
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

pub trait ManageJwtTokens {
    async fn decode_token(
        &self,
        token: String,
    ) -> Result<EmailIdentifiedCatEmployee, Box<dyn StdError>>;

    async fn generate_token(
        &self,
        authenticated_employee: &CatEmployeeCredentials,
    ) -> Result<JwtToken, Box<dyn StdError>>;
}

pub struct JwtTokenManagement {
    configuration: AuthenticationConfiguration,
}

impl JwtTokenManagement {
    pub fn new(configuration: AuthenticationConfiguration) -> Self {
        Self { configuration }
    }
}

impl ManageJwtTokens for JwtTokenManagement {
    async fn decode_token(
        &self,
        token: String,
    ) -> Result<EmailIdentifiedCatEmployee, Box<dyn StdError>> {
        let decoded = decode::<Claims>(
            token.as_str(),
            &DecodingKey::from_secret(self.configuration.secret.as_ref()),
            &Validation::new(Algorithm::HS512),
        )?;

        Ok(EmailIdentifiedCatEmployee {
            email: decoded.claims.sub,
        })
    }

    async fn generate_token(
        &self,
        authenticated_employee: &CatEmployeeCredentials,
    ) -> Result<JwtToken, Box<dyn StdError>> {
        let token = encode(
            &Header {
                alg: Algorithm::HS512,
                ..Default::default()
            },
            &Claims {
                exp: EXPIRATION_DURATION_SECONDS,
                sub: authenticated_employee.email.to_string(),
            },
            &EncodingKey::from_secret(self.configuration.secret.as_ref()),
        )?;

        Ok(JwtToken {
            token,
            cat_employee_id: 0,
            expires_in_ms: EXPIRATION_DURATION_SECONDS as u64 * 1000u64,
        })
    }
}
