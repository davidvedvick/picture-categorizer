use warp::{http::StatusCode, Filter};

#[tokio::main]
async fn main() {
    let health_route = warp::path!("api" / "health").map(|| StatusCode::OK);

    warp::serve(health_route)
        .run(([127, 0, 0, 1], 5000))
        .await;
}