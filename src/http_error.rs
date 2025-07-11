use actix_web::{HttpResponse, http::StatusCode};
use serde::Serialize;

#[derive(Serialize)]
struct Error {
    code: u16,
    message: String
}

#[derive(Serialize)]
struct HttpError {
    error: Error
}

pub fn http_error(status: StatusCode, message: &str) -> HttpResponse {
    let body = HttpError {
        error: Error {
            code: status.as_u16(),
            message: message.to_string()
        }
    };

    HttpResponse::build(status).json(body)
}
