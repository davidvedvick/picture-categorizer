#[macro_use]
extern crate lazy_static;

use std::convert::Infallible;
use std::str::FromStr;
use std::sync::Arc;

use sqlx::sqlite::SqliteConnectOptions;
use sqlx::sqlite::SqliteJournalMode::Wal;
use sqlx::SqlitePool;
use tokio::fs;
use warp::header::headers_cloned;
use warp::multipart::form;
use warp::{get, http::StatusCode, post, query, Filter};

use crate::app_config::AppConfig;
use crate::pictures::picture_repository::PictureRepository;
use crate::pictures::picture_service::PictureService;
use crate::pictures::resizing::resize_picture_service::ResizePictureService;
use crate::pictures::resizing::resize_pictures::ResizePictureProcessor;
use crate::pictures::resizing::resized_picture_management::ResizedPictureRepository;
use crate::security::jwt_token_management::JwtTokenManagement;
use crate::security::text_encoder::BCryptEncoder;
use crate::users::cat_employee_entry::CatEmployeeEntry;
use crate::users::cat_employee_repository::CatEmployeeRepository;

mod app_config;
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
    let configuration_string = fs::read_to_string("app-config.json").await.unwrap();
    let configuration = serde_json::from_str::<AppConfig>(&configuration_string).unwrap();

    let connection_configuration = configuration.db;

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

    let picture_service = Arc::new(PictureService::new(
        picture_repo.clone(),
        cat_employee_repo.clone(),
    ));

    let resize_picture_repo = ResizedPictureRepository::new(connection.clone());

    let resize_picture_service = Arc::new(ResizePictureService::new(
        resize_picture_repo.clone(),
        picture_repo.clone(),
        ResizePictureProcessor::new(resize_picture_repo, picture_repo),
    ));

    let cat_employee_entry = Arc::new(CatEmployeeEntry::new(
        cat_employee_repo,
        BCryptEncoder::new(configuration.security.encoder),
    ));

    let jwt_token_management = Arc::new(JwtTokenManagement::new(configuration.authentication));

    let get_picture_page_route = warp::path!("api" / "pictures")
        .and(get())
        .and(query())
        .and(with_cloned(picture_service.clone()))
        .and_then(pictures::picture_handlers::get_pictures_handler);

    let get_picture_file_route = warp::path!("api" / "pictures" / i64 / "file")
        .and(get())
        .and(with_cloned(picture_service.clone()))
        .and_then(pictures::picture_handlers::get_picture_file_handler);

    let add_picture_file_route = warp::path!("api" / "pictures")
        .and(post())
        .and(headers_cloned())
        .and(form().max_length(None))
        // .and(security::authentication_filter::with_auth(jwt_token_management.clone()))
        .and(with_cloned(picture_service.clone()))
        .and(with_cloned(jwt_token_management.clone()))
        .and_then(pictures::picture_handlers::add_picture_file_handler);

    let preview_picture_file_route = warp::path!("api" / "pictures" / i64 / "preview")
        .and(get())
        .and(with_cloned(resize_picture_service.clone()))
        .and_then(pictures::picture_handlers::get_picture_file_handler);

    let get_picture_tags_route = warp::path!("api" / "pictures" / i64 / "tags")
        .and(get())
        .and_then(pictures::tags::picture_tag_handlers::get_picture_tags_handler);

    let employee_login_route = warp::path!("api" / "login")
        .and(post())
        .and(warp::body::json())
        .and(with_cloned(cat_employee_entry))
        .and(with_cloned(jwt_token_management))
        .and_then(users::cat_employee_handlers::login_handler);

    let health_route = warp::path!("api" / "health").map(|| StatusCode::OK);

    let routes = health_route
        .or(add_picture_file_route)
        .or(get_picture_page_route)
        .or(get_picture_file_route)
        .or(preview_picture_file_route)
        .or(get_picture_tags_route)
        .or(employee_login_route)
        .with(warp::cors().allow_any_origin())
        .recover(errors::handle_rejection);

    warp::serve(routes).run(([127, 0, 0, 1], 5000)).await;
}
