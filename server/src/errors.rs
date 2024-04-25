use std::convert::Infallible;
use std::fmt::Debug;

use serde::Serialize;
use thiserror::Error;
use warp::http::StatusCode;
use warp::{Rejection, Reply};

#[derive(Error, Debug)]
pub enum HttpError {
    #[error("forbidden")]
    Forbidden,

    #[error("unauthorized")]
    Unauthorized,

    #[error("bad request")]
    BadRequest,

    #[error(transparent)]
    Unexpected(#[from] anyhow::Error),
}

impl warp::reject::Reject for HttpError {}

#[derive(Error, Debug)]
pub enum DataAccessError {
    #[error("data access error: {0}")]
    DataAccessError(#[from] sqlx::Error),

    #[error("operation completed unexpectedly")]
    UnexpectedCompletionError,
}

pub type DataAccessResult<T> = Result<T, DataAccessError>;

pub type RejectableResult<T> = Result<T, Rejection>;

#[derive(Serialize)]
struct ErrorResponse {
    message: String,
}

pub async fn handle_rejection(err: Rejection) -> Result<impl Reply, Infallible> {
    let (code, message) = if err.is_not_found() {
        (StatusCode::NOT_FOUND, "Not Found")
    } else if let Some(_) = err.find::<warp::filters::body::BodyDeserializeError>() {
        (StatusCode::BAD_REQUEST, "Invalid Body")
    } else if let Some(e) = err.find::<HttpError>() {
        match e {
            HttpError::BadRequest => (StatusCode::BAD_REQUEST, "Bad Request"),
            HttpError::Unauthorized => (StatusCode::UNAUTHORIZED, "Unauthorized"),
            HttpError::Forbidden => (StatusCode::FORBIDDEN, "Forbidden"),
            _ => {
                eprintln!("unhandled application error: {:?}", err);
                (StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error")
            }
        }
    } else if let Some(_) = err.find::<warp::reject::MethodNotAllowed>() {
        (StatusCode::METHOD_NOT_ALLOWED, "Method Not Allowed")
    } else {
        eprintln!("unhandled error: {:?}", err);
        (StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error")
    };

    let json = warp::reply::json(&ErrorResponse {
        message: message.into(),
    });

    Ok(warp::reply::with_status(json, code))
}
