use warp::reply::json;
use warp::Reply;

use crate::errors::RejectableResult;

pub async fn get_picture_tags_handler(picture_id: i64) -> RejectableResult<impl Reply> {
    let response: Vec<i64> = Vec::new();
    Ok(json(&response))
}
