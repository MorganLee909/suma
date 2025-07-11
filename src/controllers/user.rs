use actix_web::{post, web, HttpResponse, Responder, http::StatusCode};
use mongodb::{bson::doc, Database};
use crate::models::user::{User, NewUserInput};
use regex::Regex;
use crate::http_error::http_error;

#[post("/api/user")]
pub async fn create(
    db: web::Data<Database>,
    payload: web::Json<NewUserInput>
) -> impl Responder {
    let user_collection = db.collection::<User>("users");
    let email = payload.email.to_lowercase();
    let email_regex: Regex = Regex::new(r#"^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}(\.[0-9]{1,3}){3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$"#).unwrap();

    if !email_regex.is_match(&email) {
        return http_error(StatusCode::BAD_REQUEST, "Invalid email");
    }

    match user_collection.find_one(doc!{"email": email}, None).await {
        Ok(None) => {},
        Ok(Some(_)) => return http_error(StatusCode::BAD_REQUEST, "User with this email already exists"),
        Err(_) => return http_error(StatusCode::INTERNAL_SERVER_ERROR, "Unable to verify email")
    };

    match User::insert(&user_collection, payload.into_inner()).await {
        Ok(_) => HttpResponse::Ok().body("{'success': 'true'}"),
        Err(e) => {
            http_error(StatusCode::INTERNAL_SERVER_ERROR, "Failed to create user")
        }
    }
}
