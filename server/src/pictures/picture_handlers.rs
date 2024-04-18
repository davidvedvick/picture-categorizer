use std::sync::Arc;

use anyhow::anyhow;
use serde::Deserialize;
use warp::http::Response;
use warp::reject::custom;
use warp::reply::json;
use warp::{reject, Rejection, Reply};

use crate::errors::Error::Unexpected;
use crate::errors::RejectableResult;
use crate::pictures::picture_repository::PictureRepository;
use crate::pictures::picture_service::PictureService;
use crate::pictures::picture_service::ServePictureInformation;
use crate::pictures::serve_picture_files::ServePictureFiles;
use crate::users::cat_employee_repository::CatEmployeeRepository;

#[derive(Deserialize)]
pub struct PageQuery {
    page: Option<i32>,
    size: Option<i32>,
}

pub async fn get_pictures_handler(
    query: PageQuery,
    picture_service: Arc<PictureService<PictureRepository, CatEmployeeRepository>>,
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
