use std::fmt::Debug;

use thiserror::Error;

use crate::errors::{DataAccessError, Error};
use crate::security::text_encoder::TextEncoder;
use crate::users::cat_employee::CatEmployee;
use crate::users::cat_employee_entry::AuthenticatedCatEmployee::DisabledCatEmployee;
use crate::users::manage_cat_employees::ManageCatEmployees;

#[derive(Error, Debug)]
pub enum CatAuthenticationError {
    #[error("unexpected data access error")]
    UnexpectedDataAccessError(#[from] DataAccessError),
}

#[derive(Clone)]
pub struct CatEmployeeCredentials {
    email: String,
    password: String,
}

pub enum AuthenticatedCatEmployee {
    UnauthorizedCatEmployee(CatEmployeeCredentials),
    DisabledCatEmployee(CatEmployeeCredentials),
    AuthorizedCatEmployee(CatEmployeeCredentials),
}

pub trait AuthenticateCatEmployees {
    async fn authenticate(
        &self,
        employee_credentials: CatEmployeeCredentials,
    ) -> Result<AuthenticatedCatEmployee, CatAuthenticationError>;
}

pub struct CatEmployeeEntry<TCatEmployees: ManageCatEmployees, TEncoder: TextEncoder> {
    cat_employees: TCatEmployees,
    encoder: TEncoder,
}

impl<TCatEmployees: ManageCatEmployees, TEncoder: TextEncoder>
    CatEmployeeEntry<TCatEmployees, TEncoder>
{
    pub fn new(cat_employees: TCatEmployees, encoder: TEncoder) -> Self {
        Self {
            cat_employees,
            encoder,
        }
    }
}

impl<TCatEmployees: ManageCatEmployees, TEncoder: TextEncoder> AuthenticateCatEmployees
    for CatEmployeeEntry<TCatEmployees, TEncoder>
{
    async fn authenticate(
        &self,
        employee_credentials: CatEmployeeCredentials,
    ) -> Result<AuthenticatedCatEmployee, CatAuthenticationError> {
        let saved_employee = self
            .cat_employees
            .save(CatEmployee {
                id: 0,
                email: employee_credentials.email,
                password: self.encoder.encode(employee_credentials.password).await,
                is_enabled: false,
            })
            .await;

        return match saved_employee {
            Ok(e) => Ok(DisabledCatEmployee(CatEmployeeCredentials {
                email: e.email,
                password: e.password,
            })),
            Err(e) => Err(CatAuthenticationError::UnexpectedDataAccessError(e)),
        };
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    mod given_a_new_user {
        mod when_logging_the_user_in {
            use std::sync::Mutex;

            use async_once::AsyncOnce;
            use mockall::predicate;
            use once_cell::sync::Lazy;
            use tokio::runtime::Builder;

            use crate::security::text_encoder::MockTextEncoder;
            use crate::users::cat_employee::CatEmployee;
            use crate::users::cat_employee_entry::{
                AuthenticateCatEmployees, AuthenticatedCatEmployee, CatEmployeeCredentials,
                CatEmployeeEntry,
            };
            use crate::users::manage_cat_employees::MockManageCatEmployees;

            static EMPLOYEE_ENTRY: Lazy<CatEmployeeEntry<MockManageCatEmployees, MockTextEncoder>> =
                Lazy::new(|| {
                    let mut manage_cat_employees = MockManageCatEmployees::new();
                    manage_cat_employees.expect_save().returning(|e| {
                        ADDED_CAT_EMPLOYEES.lock().unwrap().push(e.clone());

                        Ok(e)
                    });

                    let mut text_encoder = MockTextEncoder::new();
                    text_encoder
                        .expect_encode()
                        .with(predicate::eq("SOyRfcI".to_string()))
                        .returning(|_| "eOLdjk".to_string());

                    CatEmployeeEntry::new(manage_cat_employees, text_encoder)
                });

            lazy_static! {
                static ref ADDED_CAT_EMPLOYEES: Mutex<Vec<CatEmployee>> = Mutex::new(Vec::new());
                static ref AUTHENTICATED_CAT_EMPLOYEE: AsyncOnce<AuthenticatedCatEmployee> =
                    AsyncOnce::new(async {
                        EMPLOYEE_ENTRY
                            .authenticate(CatEmployeeCredentials {
                                email: "4Z00cpZ".to_string(),
                                password: "SOyRfcI".to_string(),
                            })
                            .await
                            .unwrap()
                    });
            }

            #[test]
            fn then_the_added_employee_is_correct() {
                let rt = Builder::new_current_thread().build().unwrap();
                rt.block_on(async {
                    AUTHENTICATED_CAT_EMPLOYEE.get().await;
                    let cat_employees = ADDED_CAT_EMPLOYEES.lock().unwrap().clone();
                    assert_eq!(
                        *cat_employees,
                        vec![CatEmployee {
                            id: 0,
                            email: "4Z00cpZ".to_string(),
                            password: "eOLdjk".to_string(),
                            is_enabled: false,
                        }]
                    );
                });
            }

            #[test]
            fn then_the_authenticated_employee_is_disabled() {
                let rt = Builder::new_current_thread().build().unwrap();
                rt.block_on(async {
                    let authenticated_employee = AUTHENTICATED_CAT_EMPLOYEE.get().await;
                    assert!(matches!(
                        authenticated_employee,
                        AuthenticatedCatEmployee::DisabledCatEmployee(_)
                    ));
                });
            }
        }
    }
}
