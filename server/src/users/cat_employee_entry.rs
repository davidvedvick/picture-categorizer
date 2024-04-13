use std::fmt::Debug;

use thiserror::Error;

use crate::errors::{DataAccessError, Error};
use crate::security::text_encoder::TextEncoder;
use crate::users::cat_employee::CatEmployee;
use crate::users::cat_employee_entry::AuthenticatedCatEmployee::{
    AuthorizedCatEmployee, DisabledCatEmployee,
};
use crate::users::manage_cat_employees::ManageCatEmployees;

#[derive(Error, Debug)]
pub enum CatAuthenticationError {
    #[error("unexpected data access error")]
    UnexpectedDataAccessError(#[from] DataAccessError),
}

#[derive(Clone, Debug, PartialEq)]
pub struct CatEmployeeCredentials {
    email: String,
    password: String,
}

#[derive(Debug, PartialEq)]
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
        let employee_email = employee_credentials.email;

        let employee = match self
            .cat_employees
            .find_by_email(employee_email.to_string())
            .await
        {
            Ok(Some(e)) => e,
            Ok(None) => match self
                .cat_employees
                .save(CatEmployee {
                    id: 0,
                    email: employee_email.to_string(),
                    password: self.encoder.encode(employee_credentials.password).await,
                    is_enabled: false,
                })
                .await
            {
                Ok(e) => e,
                Err(e) => return Err(CatAuthenticationError::UnexpectedDataAccessError(e)),
            },
            Err(e) => return Err(CatAuthenticationError::UnexpectedDataAccessError(e)),
        };

        return if employee.is_enabled {
            Ok(AuthorizedCatEmployee(CatEmployeeCredentials {
                email: employee.email,
                password: employee.password,
            }))
        } else {
            Ok(DisabledCatEmployee(CatEmployeeCredentials {
                email: employee.email,
                password: employee.password,
            }))
        };
    }
}

#[cfg(test)]
mod tests {
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

    use super::*;

    mod given_a_new_user {
        use super::*;

        mod when_logging_the_user_in {
            use super::*;

            static EMPLOYEE_ENTRY: Lazy<CatEmployeeEntry<MockManageCatEmployees, MockTextEncoder>> =
                Lazy::new(|| {
                    let mut manage_cat_employees = MockManageCatEmployees::new();
                    manage_cat_employees
                        .expect_find_by_email()
                        .returning(|e| Ok(None));
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
                    assert!(matches!(authenticated_employee, DisabledCatEmployee(_)));
                });
            }
        }
    }

    mod given_an_existing_disabled_user {
        use super::*;

        mod when_logging_the_user_in {
            use super::*;

            static EMPLOYEE_ENTRY: Lazy<CatEmployeeEntry<MockManageCatEmployees, MockTextEncoder>> =
                Lazy::new(|| {
                    let mut manage_cat_employees = MockManageCatEmployees::new();
                    manage_cat_employees
                        .expect_find_by_email()
                        .with(predicate::eq("4Z00cpZ".to_string()))
                        .returning(|e| {
                            Ok(Some(CatEmployee {
                                id: 518,
                                email: e.to_string(),
                                password: "SOyRfcI".to_string(),
                                is_enabled: false,
                            }))
                        });

                    manage_cat_employees.expect_save().returning(|e| {
                        ADDED_CAT_EMPLOYEES.lock().unwrap().push(e.clone());

                        Ok(e)
                    });

                    let mut text_encoder = MockTextEncoder::new();
                    text_encoder
                        .expect_encode()
                        .with(predicate::eq("SOyRfcI".to_string()))
                        .returning(|_| "eOLdjk".to_string());

                    text_encoder
                        .expect_matches()
                        .returning(|r, e| r == "SOyRfcI" && e == "eOLdjk");

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
            fn then_no_employee_is_added() {
                let rt = Builder::new_current_thread().build().unwrap();
                rt.block_on(async {
                    AUTHENTICATED_CAT_EMPLOYEE.get().await;
                    let cat_employees = ADDED_CAT_EMPLOYEES.lock().unwrap().clone();
                    assert_eq!(*cat_employees, Vec::new());
                });
            }

            #[test]
            fn then_the_authenticated_employee_is_disabled() {
                let rt = Builder::new_current_thread().build().unwrap();
                rt.block_on(async {
                    let authenticated_employee = AUTHENTICATED_CAT_EMPLOYEE.get().await;
                    assert!(matches!(authenticated_employee, DisabledCatEmployee(_)));
                });
            }
        }
    }

    mod given_an_existing_user {
        use super::*;

        mod and_the_password_matches {
            use super::*;

            mod when_logging_the_user_in {
                use crate::users::cat_employee_entry::AuthenticatedCatEmployee::AuthorizedCatEmployee;

                use super::*;

                static EMPLOYEE_ENTRY: Lazy<
                    CatEmployeeEntry<MockManageCatEmployees, MockTextEncoder>,
                > = Lazy::new(|| {
                    let mut manage_cat_employees = MockManageCatEmployees::new();
                    manage_cat_employees
                        .expect_find_by_email()
                        .with(predicate::eq("2l9L".to_string()))
                        .returning(|e| {
                            Ok(Some(CatEmployee {
                                id: 822,
                                email: e.to_string(),
                                password: "MobWbSRg".to_string(),
                                is_enabled: true,
                            }))
                        });

                    let mut text_encoder = MockTextEncoder::new();

                    text_encoder
                        .expect_matches()
                        .returning(|r, e| r == "zc89" && e == "MobWbSRg");

                    CatEmployeeEntry::new(manage_cat_employees, text_encoder)
                });

                lazy_static! {
                    static ref AUTHENTICATED_CAT_EMPLOYEE: AsyncOnce<AuthenticatedCatEmployee> =
                        AsyncOnce::new(async {
                            EMPLOYEE_ENTRY
                                .authenticate(CatEmployeeCredentials {
                                    email: "2l9L".to_string(),
                                    password: "zc89".to_string(),
                                })
                                .await
                                .unwrap()
                        });
                }

                #[test]
                fn then_the_employee_is_authorized() {
                    let rt = Builder::new_current_thread().build().unwrap();
                    rt.block_on(async {
                        let authenticated_employee = AUTHENTICATED_CAT_EMPLOYEE.get().await;
                        assert_eq!(
                            *authenticated_employee,
                            AuthorizedCatEmployee(CatEmployeeCredentials {
                                password: "MobWbSRg".to_string(),
                                email: "2l9L".to_string(),
                            })
                        );
                    });
                }
            }
        }
    }
}
