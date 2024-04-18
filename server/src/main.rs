#[macro_use]
extern crate lazy_static;

use std::convert::Infallible;
use std::str::FromStr;
use std::sync::Arc;

use sqlx::sqlite::SqliteConnectOptions;
use sqlx::sqlite::SqliteJournalMode::Wal;
use sqlx::{Connection, SqlitePool};
use warp::{http::StatusCode, query, Filter};

use crate::connection_config::ConnectionConfiguration;
use crate::pictures::picture_repository::PictureRepository;
use crate::pictures::picture_service::PictureService;
use crate::pictures::resizing::resize_picture_service::ResizePictureService;
use crate::pictures::resizing::resize_pictures::ResizePictureProcessor;
use crate::pictures::resizing::resized_picture_management::ResizedPictureRepository;
use crate::users::cat_employee_repository::CatEmployeeRepository;

mod connection_config;
mod errors;
mod page;
mod pictures;
mod security;
mod users;

fn with_cloned<T: Clone + Send>(
    clonable: T,
) -> impl Filter<Extract = (T,), Error = Infallible> + Clone {
    warp::any().map(move || clonable.clone())
}

#[tokio::main]
async fn main() {
    let health_route = warp::path!("api" / "health").map(|| StatusCode::OK);

    let connection_configuration = ConnectionConfiguration {
        file: "/home/david/.catpics/pics.db".to_string(),
    };

    let database_file = connection_configuration.file;

    let connection = SqlitePool::connect_with(
        SqliteConnectOptions::from_str(&format!("sqlite://{database_file}"))
            .unwrap()
            .journal_mode(Wal),
    )
    .await
    .unwrap();

    let picture_repo = PictureRepository::new(connection.clone());

    let cat_employee_repo = CatEmployeeRepository::new(connection.clone());

    let picture_service = Arc::new(PictureService::new(picture_repo.clone(), cat_employee_repo));

    let resize_picture_repo = ResizedPictureRepository::new(connection.clone());

    let resize_picture_service = Arc::new(ResizePictureService::new(
        resize_picture_repo.clone(),
        picture_repo.clone(),
        ResizePictureProcessor::new(resize_picture_repo, picture_repo),
    ));

    let get_picture_page_route = warp::path!("api" / "pictures")
        .and(query())
        .and(with_cloned(picture_service.clone()))
        .and_then(pictures::picture_handlers::get_pictures_handler);

    let get_picture_file_route = warp::path!("api" / "pictures" / i64 / "file")
        .and(with_cloned(picture_service.clone()))
        .and_then(pictures::picture_handlers::get_picture_file_handler);

    let preview_picture_file_route = warp::path!("api" / "pictures" / i64 / "preview")
        .and(with_cloned(resize_picture_service.clone()))
        .and_then(pictures::picture_handlers::get_picture_file_handler);

    let get_picture_tags_route = warp::path!("api" / "pictures" / i64 / "tags")
        .and_then(pictures::tags::picture_tag_handlers::get_picture_tags_handler);

    let routes = health_route
        .or(get_picture_page_route)
        .or(get_picture_file_route)
        .or(preview_picture_file_route)
        .or(get_picture_tags_route)
        .with(warp::cors().allow_any_origin())
        .recover(errors::handle_rejection);

    warp::serve(routes).run(([127, 0, 0, 1], 5000)).await;
}
