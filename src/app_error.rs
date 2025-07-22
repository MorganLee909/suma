use actix_web::{HttpResponse, ResponseError, http::StatusCode};
use thiserror::Error;
use serde::Serialize;

#[derive(Debug, Serialize)]
struct ErrorBody {
    error: ErrorInfo
}

#[derive(Debug, Serialize)]
struct ErrorInfo {
    code: u16,
    message: String
}

#[derive(Debug, Error)]
pub enum AppError {
    #[error("Database error")]
    Database(#[from] mongodb::error::Error),

    #[error("Invalid ID")]
    InvalidID(#[from] bson::oid::Error),

    #[error("{0}")]
    InvalidInput(String),

    #[error("{0}")]
    InternalError(String),

    #[error("Unauthorized")]
    Auth
}

impl ResponseError for AppError {
    fn status_code(&self) -> StatusCode {
        match self {
            AppError::Database(_) => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::InvalidID(_) => StatusCode::BAD_REQUEST,
            AppError::InvalidInput(_) => StatusCode::BAD_REQUEST,
            AppError::InternalError(_) => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::Auth => StatusCode::UNAUTHORIZED
        }
    }

    fn error_response(&self) -> HttpResponse {
        let body = ErrorBody {
            error: ErrorInfo {
                code: self.status_code().as_u16(),
                message: self.to_string()
            }
        };

        HttpResponse::build(self.status_code()).json(body)
    }
}

impl AppError {
    pub fn invalid_input(msg: &str) -> Self {
        AppError::InvalidInput(msg.to_owned())
    }

    pub fn internal_error(msg: &str) -> Self {
        AppError::InternalError(msg.to_owned())
    }
}
