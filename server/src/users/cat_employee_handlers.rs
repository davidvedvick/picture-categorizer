use std::sync::Arc;

use anyhow::anyhow;
use warp::reject::custom;
use warp::reply::json;
use warp::{reject, Reply};

use crate::errors::Error::Unexpected;
use crate::errors::RejectableResult;
use crate::security::jwt_token_management::ManageJwtTokens;
use crate::users::cat_employee_entry::{
    AuthenticateCatEmployees, AuthenticatedCatEmployee, CatEmployeeCredentials,
};

#[derive(Debug)]
pub struct Unauthorized;

impl reject::Reject for Unauthorized {}

pub async fn login_handler<
    TAuthenticateCatEmployees: AuthenticateCatEmployees,
    TManageJwtTokens: ManageJwtTokens,
>(
    body: CatEmployeeCredentials,
    authentication_service: Arc<TAuthenticateCatEmployees>,
    manage_jwt_tokens: Arc<TManageJwtTokens>,
) -> RejectableResult<impl Reply> {
    let employee = authentication_service
        .authenticate(body)
        .await
        .map_err(|e| custom(Unexpected(anyhow!(e.to_string()))))?;

    match employee {
        AuthenticatedCatEmployee::UnauthorizedCatEmployee(_)
        | AuthenticatedCatEmployee::DisabledCatEmployee(_) => Err(custom(Unauthorized)),
        AuthenticatedCatEmployee::AuthorizedCatEmployee(e) => {
            let token = manage_jwt_tokens
                .generate_token(&e)
                .await
                .map_err(|e| custom(Unexpected(anyhow!(e.to_string()))))?;
            Ok(json(&token))
        }
    }
}
