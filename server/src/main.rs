#[macro_use]
extern crate lazy_static;

use std::convert::Infallible;
use std::sync::Arc;

use sqlite::Connection;
use warp::{http::StatusCode, query, Filter};

use crate::connection_config::ConnectionConfiguration;
use crate::pictures::picture_repository::PictureRepository;
use crate::pictures::picture_service::PictureService;
use crate::users::cat_employee_repository::CatEmployeeRepository;

mod connection_config;
mod errors;
mod page;
mod pictures;
mod users;

type ShareablePictureService = Arc<PictureService<PictureRepository, CatEmployeeRepository>>;

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

    let picture_repo = match Connection::open_thread_safe(connection_configuration.clone().file) {
        Ok(connection) => PictureRepository::new(connection),
        Err(e) => return,
    };

    let cat_employee_repo =
        match Connection::open_thread_safe(connection_configuration.clone().file) {
            Ok(connection) => CatEmployeeRepository::new(connection),
            Err(e) => return,
        };

    let picture_service = Arc::new(PictureService::new(picture_repo, cat_employee_repo));

    let get_picture_page_route = warp::path!("api" / "pictures")
        .and(query())
        .and(with_cloned(picture_service.clone()))
        .and_then(pictures::picture_handlers::get_pictures_handler);

    let get_picture_file_route = warp::path!("api" / "pictures" / i64 / "file")
        .and(with_cloned(picture_service.clone()))
        .and_then(pictures::picture_handlers::get_picture_file_handler);

    let routes = health_route
        .or(get_picture_page_route)
        .or(get_picture_file_route)
        .with(warp::cors().allow_any_origin())
        .recover(errors::handle_rejection);

    warp::serve(routes).run(([127, 0, 0, 1], 5000)).await;
}
