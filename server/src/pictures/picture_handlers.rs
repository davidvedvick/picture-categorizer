use sqlite::Connection;
use warp::reject::custom;
use warp::reply::json;
use warp::{reject, Reply};

use crate::connection_config::ConnectionConfiguration;
use crate::errors::Error::Unknown;
use crate::errors::RejectableResult;
use crate::pictures::manage_pictures::ManagePictures;
use crate::pictures::picture_information::PictureInformation;
use crate::pictures::picture_repository::PictureRepository;

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
