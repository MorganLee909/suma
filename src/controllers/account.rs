use actix_web::{web, post, put, HttpResponse, HttpRequest};
use mongodb::Database;
use bson::oid::ObjectId;

use crate::models::account::Account;
use crate::auth::user_auth;
use crate::app_error::AppError;
use crate::dto::account::{CreateInput, UpdateInput};

#[post("/api/account")]
pub async fn create_route(
    db: web::Data<Database>,
    req: HttpRequest,
    body: web::Json<CreateInput>
) -> Result<HttpResponse, AppError> {
    let user = user_auth(&db, &req).await?;
    let account_collection = db.collection::<Account>("accounts");
    let account_id = Account::insert(&account_collection, body.into_inner(), user).await?;
    let account = Account::find_by_id(&account_collection, account_id).await?;
    Ok(HttpResponse::Ok().json(account.response()))
}

#[put("/api/account")]
pub async fn update_route(
    db: web::Data<Database>,
    req: HttpRequest,
    body: web::Json<UpdateInput>
) -> Result<HttpResponse, AppError> {
    let user = user_auth(&db, &req).await?;
    let account_collection = db.collection::<Account>("accounts");
    Account::user_owns(&account_collection, &user, &body.id).await?;
    let account_id = ObjectId::parse_str(&body.id)?;
    let account = Account::update(&account_collection, account_id, &body.data).await?;
    Ok(HttpResponse::Ok().json(account.response()))
}
