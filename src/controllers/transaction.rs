use actix_web::{post, web, HttpResponse, HttpRequest};
use mongodb::{Database, Collection};

use crate::models::transaction::Transaction;
use crate::app_error::AppError;
use crate::auth::user_auth;
use crate::dto::transaction::CreateInput;

#[post("/api/transaction")]
pub async fn create_route(
    db: web::Data<Database>,
    body: web::Json<CreateInput>,
    request: HttpRequest
) -> Result<HttpResponse, AppError> {
    let user = user_auth(&db, &request).await?;
    let transaction_collection = db.collection::<Transaction>("transactions");
    Ok(HttpResponse::Ok().json(user.response(None)))
}
