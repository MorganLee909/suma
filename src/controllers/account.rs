use actix_web::{post, web, HttpResponse, HttpRequest};
use mongodb::Database;

use crate::models::account::Account;
use crate::auth::user_auth;
use crate::app_error::AppError;
use crate::dto;

#[post("/api/account")]
pub async fn create_route(
    db: web::Data<Database>,
    req: HttpRequest,
    body: web::Json<dto::account::CreateInput>
) -> Result<HttpResponse, AppError> {
    let user = user_auth(&db, &req).await?;
    let account_collection = db.collection::<Account>("accounts");
    let account_id = Account::insert(&account_collection, body.into_inner(), user).await?;
    let account = Account::find_by_id(&account_collection, account_id).await?;
    Ok(HttpResponse::Ok().json(account.response()))
}
