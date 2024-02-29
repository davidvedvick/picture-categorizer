use serde::Deserialize;
use sqlite::Connection;
use warp::http::Response;
use warp::reject::custom;
use warp::reply::json;
use warp::{reject, Reply};

use crate::connection_config::ConnectionConfiguration;
use crate::errors::Error::Unknown;
use crate::errors::RejectableResult;
use crate::pictures::manage_pictures::ManagePictures;
use crate::pictures::picture_information::PictureInformation;
use crate::pictures::picture_repository::PictureRepository;
use crate::pictures::picture_service::PictureService;
use crate::pictures::serve_pictures::{ServePictureFiles, ServePictureInformation};

#[derive(Deserialize)]
pub struct PageQuery {
    page: Option<i32>,
    size: Option<i32>,
}

pub async fn get_pictures_handler(
    query: PageQuery,
    connection_configuration: ConnectionConfiguration,
) -> RejectableResult<impl Reply> {
    let connection = Connection::open_thread_safe(connection_configuration.file).unwrap();
    let picture_repo = PictureRepository::new(connection);
    let picture_service = PictureService::new(picture_repo);
    let pictures = picture_service
        .get_picture_information(query.page, query.size)
        .await;

    Ok(json(&pictures))
}

pub async fn get_picture_file_handler(
    id: i64,
    connection_configuration: ConnectionConfiguration,
) -> RejectableResult<impl Reply> {
    let connection = Connection::open_thread_safe(connection_configuration.file).unwrap();
    let picture_repo = PictureRepository::new(connection);
    let picture_service = PictureService::new(picture_repo);
    let option = picture_service.get_picture_file(id).await;

    match option {
        Some(p) => Ok(Response::builder()
            .header("cache-control", "public, max-age=31536000, immutable")
            .body(p.file)),
        None => Err(reject::not_found()),
    }
}

pub async fn get_picture_handler(
    id: i64,
    connection_configuration: ConnectionConfiguration,
) -> RejectableResult<impl Reply> {
    let connection = Connection::open_thread_safe(connection_configuration.file).unwrap();
    let pictures = PictureRepository::new(connection);
    let option = pictures
        .find_by_id(id)
        .await
        .map_err(|_e| custom(Unknown))?;
    match option {
        Some(p) => Ok(json(&PictureInformation {
            id: p.id,
            file_name: p.file_name,
            cat_employee_id: p.cat_employee_id,
        })),
        None => Err(reject::not_found()),
    }
}
