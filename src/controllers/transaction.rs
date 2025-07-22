use actix_web::{post, web, HttpResponse, HttpRequest};
use mongodb::Database;

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
    let id = Transaction::insert(&transaction_collection, body.into_inner()).await?;
    let transaction = Transaction::find_one(&transaction_collection, id).await?;
    Ok(HttpResponse::Ok().json(transaction.response()))
}
