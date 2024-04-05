#[macro_use]
extern crate lazy_static;

use std::convert::Infallible;

use warp::{http::StatusCode, query, Filter};

use crate::connection_config::ConnectionConfiguration;

mod connection_config;
mod errors;
mod page;
mod pictures;
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

    let get_picture_page_route = warp::path!("api" / "pictures")
        .and(query())
        .and(with_cloned(connection_configuration.clone()))
        .and_then(pictures::picture_handlers::get_pictures_handler);

    let get_picture_route = warp::path!("api" / "pictures" / i64)
        .and(with_cloned(connection_configuration.clone()))
        .and_then(pictures::picture_handlers::get_picture_handler);

    let get_picture_file_route = warp::path!("api" / "pictures" / i64 / "file")
        .and(with_cloned(connection_configuration.clone()))
        .and_then(pictures::picture_handlers::get_picture_file_handler);

    let routes = health_route
        .or(get_picture_page_route)
        .or(get_picture_route)
        .or(get_picture_file_route)
        .with(warp::cors().allow_any_origin())
        .recover(errors::handle_rejection);

    warp::serve(routes).run(([127, 0, 0, 1], 5000)).await;
}
