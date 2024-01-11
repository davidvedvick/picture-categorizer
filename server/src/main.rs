use warp::{http::StatusCode, Filter};

mod pictures;

#[tokio::main]
async fn main() {
    // let connection = sqlite::open(":memory:").unwrap();

    // let query = "SELECT * FROM users WHERE age > ?";
    //
    // for row in connection
    //     .prepare(query)
    //     .unwrap()
    //     .into_iter()
    //     .bind((1, 50))
    //     .unwrap()
    //     .map(|row| row.unwrap())
    // {
    //     let data = row.read::<Vec<u8>, _>("age");
    //     println!("name = {}", row.read::<&str, _>("name"));
    //     println!("age = {}", row.read::<Vec<u8>, _>("age"));
    // }


    let health_route = warp::path!("api" / "health").map(|| StatusCode::OK);

    warp::serve(health_route)
        .run(([127, 0, 0, 1], 5000))
        .await;
}