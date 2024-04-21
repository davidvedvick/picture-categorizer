use bcrypt::BcryptError;
use mockall::automock;
use serde::{Deserialize, Serialize};
use thiserror::Error;

use crate::security::text_encoder::TextEncoderError::BCryptEncodingError;

#[derive(Serialize, Deserialize, Clone)]
pub struct EncoderConfig {
    #[serde(default)]
    salt_generations: u32,
}

impl Default for EncoderConfig {
    fn default() -> Self {
        Self {
            salt_generations: 10,
        }
    }
}

#[derive(Error, Debug)]
pub enum TextEncoderError {
    #[error("error encountered encoding password using BCrypt")]
    BCryptEncodingError(#[from] BcryptError),
}

#[automock]
pub trait TextEncoder {
    async fn encode(&self, raw_password: String) -> Result<String, TextEncoderError>;

    async fn matches(&self, raw_password: String, encoded_password: String) -> bool;
}

pub struct BCryptEncoder {
    encoder_config: EncoderConfig,
}

impl BCryptEncoder {
    pub(crate) fn new(encoder_config: EncoderConfig) -> Self {
        Self { encoder_config }
    }
}

impl TextEncoder for BCryptEncoder {
    async fn encode(&self, raw_password: String) -> Result<String, TextEncoderError> {
        bcrypt::hash(raw_password, self.encoder_config.salt_generations)
            .map_err(BCryptEncodingError)
    }

    async fn matches(&self, raw_password: String, encoded_password: String) -> bool {
        bcrypt::verify(raw_password, &encoded_password).unwrap_or_else(|_| false)
    }
}

#[cfg(test)]
mod tests {
    mod given_a_password {
        mod and_a_hashed_password {
            use async_once::AsyncOnce;
            use once_cell::sync::Lazy;
            use tokio::runtime::Builder;

            use crate::security::text_encoder::{BCryptEncoder, EncoderConfig, TextEncoder};

            static BCRYPT_ENCODER: Lazy<BCryptEncoder> = Lazy::new(|| {
                BCryptEncoder::new(EncoderConfig {
                    salt_generations: 874,
                })
            });

            lazy_static! {
                static ref RESULT: AsyncOnce<bool> = AsyncOnce::new(async {
                    BCRYPT_ENCODER
                        .matches(
                            "k2H2hM`LlV46b>y\\ND>Q".to_string(),
                            "$2a$10$lfKDiuqC2o/iyg5f6.bUOOOZarDQtZ97rmhkOqRQGVV2Ib2nIGMpO"
                                .to_string(),
                        )
                        .await
                });
            }

            #[test]
            fn then_the_result_matches() {
                let rt = Builder::new_current_thread().build().unwrap();
                rt.block_on(async { assert!(*RESULT.get().await) });
            }
        }
    }
}
