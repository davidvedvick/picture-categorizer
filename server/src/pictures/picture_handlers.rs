use std::sync::Arc;

use anyhow::anyhow;
use bytes::buf::BufMut;
use futures::TryStreamExt;
use serde::Deserialize;
use warp::http::header::AUTHORIZATION;
use warp::http::Response;
use warp::hyper::HeaderMap;
use warp::multipart::FormData;
use warp::reject::custom;
use warp::reply::json;
use warp::{reject, Rejection, Reply};

use crate::errors::HttpError::{BadRequest, Unauthorized, Unexpected};
use crate::errors::RejectableResult;
use crate::pictures::picture_service::{SavingPictureError, ServePictureInformation};
use crate::pictures::serve_picture_files::{PictureFile, ServePictureFiles};
use crate::security::jwt_token_management::{ManageJwtTokens, TokenDecodingError};

#[derive(Deserialize)]
pub struct PageQuery {
    page: Option<i32>,
    size: Option<i32>,
}

pub async fn get_pictures_handler<TServePictureInformation: ServePictureInformation>(
    query: PageQuery,
    picture_service: Arc<TServePictureInformation>,
) -> Result<impl Reply, Rejection> {
    let result = picture_service
        .get_picture_information(query.page, query.size)
        .await;

    match result {
        Ok(p) => Ok(json(&p)),
        Err(e) => Err(custom(Unexpected(anyhow!(e.to_string())))),
    }
}

pub async fn get_picture_file_handler<TServePictureFiles: ServePictureFiles>(
    id: i64,
    picture_service: Arc<TServePictureFiles>,
) -> RejectableResult<impl Reply> {
    let option = picture_service.get_picture_file(id).await;

    match option {
        Ok(Some(p)) => Ok(Response::builder()
            .header("cache-control", "public, max-age=31536000, immutable")
            .body(p.file)),
        Ok(None) => Err(reject::not_found()),
        Err(e) => Err(custom(Unexpected(anyhow!(e.to_string())))),
    }
}

pub async fn add_picture_file_handler<
    TServePictureInformation: ServePictureInformation,
    TManageJwtTokens: ManageJwtTokens,
>(
    header_map: HeaderMap,
    form: FormData,
    manage_pictures: Arc<TServePictureInformation>,
    jwt_token_management: Arc<TManageJwtTokens>,
) -> RejectableResult<impl Reply> {
    let token_header = header_map.get(AUTHORIZATION).ok_or(custom(BadRequest))?;
    let token = token_header
        .to_str()
        .map_err(|e| custom(Unexpected(anyhow!(e))))?;

    let parts: Vec<_> = form
        .and_then(|mut field| async move {
            let mut bytes: Vec<u8> = Vec::new();

            // field.data() only returns a piece of the content, you should call over it until it replies None
            while let Some(content) = field.data().await {
                let content = content.unwrap();
                bytes.put(content);
            }

            Ok((
                field.filename().map(|n| n.to_owned()),
                field.content_type().map(|t| t.to_owned()),
                bytes,
            ))
        })
        .try_collect()
        .await
        .map_err(|e| custom(Unexpected(anyhow!(e.to_string()))))?;

    let (filename_opt, content_type_opt, file_data) =
        parts.first().ok_or(custom(BadRequest))?.to_owned();

    let picture_file = PictureFile {
        file_name: filename_opt.ok_or(custom(BadRequest))?.to_string(),
        mime_type: content_type_opt.ok_or(custom(BadRequest))?.to_string(),
        file: file_data,
    };

    let authenticated_user = jwt_token_management
        .decode_token(token.to_string())
        .await
        .map_err(|e| match e {
            TokenDecodingError::Expired => custom(Unauthorized),
            _ => custom(Unexpected(anyhow!(e.to_string()))),
        })?;

    let picture = manage_pictures
        .add_picture(picture_file, authenticated_user)
        .await
        .map_err(|e| {
            custom(match e {
                SavingPictureError::UnknownCatEmployee(_) => Unauthorized,
                _ => Unexpected(anyhow!(e.to_string())),
            })
        })?;

    Ok(json(&picture))
}
