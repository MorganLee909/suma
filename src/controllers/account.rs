use actix_web::{post, web, HttpResponse, HttpRequest};
use mongodb::Database;

use crate::models::account::{Account};
use crate::auth::user_auth;
use crate::app_error::AppError;
use crate::dto::account;

#[post("/api/account")]
pub async fn create_route(
    db: web::Data<Database>,
    req: HttpRequest,
    body: web::Json<account::CreateInput>
) -> Result<HttpResponse, AppError> {
    let user = user_auth(&db, &req).await?;
    let account_collection = db.collection::<Account>("accounts");
    Ok(HttpResponse::Ok().body("Ok"))
}
