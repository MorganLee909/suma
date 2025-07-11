use actix_web::{post, web, HttpResponse, cookie::Cookie};
use mongodb::{bson::doc, Database, Collection};
use crate::models::user::{User, NewUserInput};
use regex::Regex;
use crate::dto;
use crate::app_error::AppError;
use serde_json::json;

#[post("/api/user")]
pub async fn create_route(
    db: web::Data<Database>,
    payload: web::Json<NewUserInput>
) -> Result<HttpResponse, AppError> {
    let user_collection = db.collection::<User>("users");
    let email = payload.email.to_lowercase();
    valid_email(&email)?;
    user_exists(&user_collection, &email).await?;
    User::insert(&user_collection, payload.into_inner()).await?;
    Ok(HttpResponse::Ok().json(json!({"success": true})))
}

#[post("/api/user/login")]
pub async fn login_route(
    db: web::Data<Database>,
    payload: web::Json<dto::user::Login>
) -> Result<HttpResponse, AppError> {
    let user_collection = db.collection::<User>("users");
    let email = payload.email.to_lowercase();
    let user = User::find_by_email(&user_collection, &email).await?;
    validate_password(&user, &payload.password_hash, &payload.password_salt)?;
    let cookie = create_user_cookie(user._id.unwrap().to_string());
    Ok(HttpResponse::Ok().cookie(cookie).json(response_user(user)))
}

fn valid_email(email: &str) -> Result<(), AppError> {
    let email_regex: Regex = Regex::new(r#"^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}(\.[0-9]{1,3}){3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$"#).unwrap();

    if email_regex.is_match(email) {
        return Ok(());
    }

    Err(AppError::invalid_input("Invalid email address"))
}

async fn user_exists(collection: &Collection<User>, email: &str) -> Result<(), AppError> {
    match collection.find_one(doc!{"email": email}, None).await {
        Ok(None) => Ok(()),
        Ok(Some(_)) => Err(AppError::invalid_input("User with this email already exists")),
        Err(_) => Err(AppError::internal_error("Unable to save user data"))
    }
}

fn validate_password(user: &User, hash: &str, salt: &str) -> Result<(), AppError> {
    if user.password_hash != hash || user.password_salt != salt{
        return Err(AppError::invalid_input("Invalid credentials"));
    }
    Ok(())
}

fn create_user_cookie(id: String) -> Cookie<'static> {
    Cookie::build("user", id)
        .path("/")
        .http_only(true)
        .finish()
}

fn response_user(user: User) -> dto::user::ResponseUser {
    dto::user::ResponseUser {
        id: user._id.unwrap().to_string(),
        email: user.email,
        created_at: user.created_at.timestamp_millis()
    }
}
