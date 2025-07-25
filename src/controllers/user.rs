use actix_web::{get, post, web, HttpResponse, HttpRequest, cookie::Cookie};
use mongodb::{bson::doc, Database, Collection};
use regex::Regex;
use serde_json::json;

use crate::models::user::User;
use crate::models::account::{Account};
use crate::dto::user::{CreateInput, LoginInput, GetPasswordSaltInput};
use crate::app_error::AppError;
use crate::auth::user_auth;

#[post("/api/user/salt")]
pub async fn get_password_salt_route(
    db: web::Data<Database>,
    body: web::Json<GetPasswordSaltInput>
) -> Result<HttpResponse, AppError> {
    let user_collection = db.collection::<User>("users");
    let user = User::find_by_email(&user_collection, &body.email.to_lowercase()).await?;
    Ok(HttpResponse::Ok().json(json!({"password_salt": user.password_salt})))
}

#[post("/api/user")]
pub async fn create_route(
    db: web::Data<Database>,
    payload: web::Json<CreateInput>
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
    payload: web::Json<LoginInput>
) -> Result<HttpResponse, AppError> {
    let user_collection = db.collection::<User>("users");
    let email = payload.email.to_lowercase();
    let user = User::find_by_email(&user_collection, &email).await?;
    validate_password(&user, &payload.password_hash, &payload.password_salt)?;
    let cookie = create_user_cookie(Some(user.id.to_string()));
    Ok(HttpResponse::Ok().cookie(cookie).json(user.response(None)))
}

#[get("/api/user/logout")]
pub async fn logout_route() -> Result<HttpResponse, AppError> {
    let cookie = create_user_cookie(None);
    Ok(HttpResponse::Ok().cookie(cookie).json(json!({"success": true})))
}

#[get("/api/user")]
pub async fn get_route(db: web::Data<Database>, req: HttpRequest) -> Result<HttpResponse, AppError> {
    let user = user_auth(&db, &req).await?;
    let account_collection = db.collection::<Account>("accounts");
    let accounts = Account::find_by_user(&account_collection, user.id).await?;
    let response_accounts = accounts.into_iter().map(Account::response).collect();
    Ok(HttpResponse::Ok().json(user.response(Some(response_accounts))))
}

fn valid_email(email: &str) -> Result<(), AppError> {
    let email_regex: Regex = Regex::new(r#"^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}(\.[0-9]{1,3}){3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$"#).unwrap();

    if email_regex.is_match(email) {
        return Ok(());
    }

    Err(AppError::invalid_input("Invalid email address"))
}

async fn user_exists(collection: &Collection<User>, email: &str) -> Result<(), AppError> {
    match collection.find_one(doc!{"email": email}).await {
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

fn create_user_cookie(id: Option<String>) -> Cookie<'static> {
    let id_string = match id {
        Some(i) => i,
        None => "".to_string()
    };

    Cookie::build("user", id_string)
        .path("/")
        .http_only(true)
        .finish()
}
