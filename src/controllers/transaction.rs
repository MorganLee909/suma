use actix_web::{web, post, put, HttpResponse, HttpRequest};
use mongodb::Database;
use bson::oid::ObjectId;

use crate::models::transaction::{Transaction, ResponseTransaction};
use crate::models::account::Account;
use crate::app_error::AppError;
use crate::auth::user_auth;
use crate::dto::transaction::{CreateInput, SearchInput, UpdateInput};

#[post("/api/transaction")]
pub async fn create_route(
    db: web::Data<Database>,
    body: web::Json<CreateInput>,
    request: HttpRequest
) -> Result<HttpResponse, AppError> {
    let user = user_auth(&db, &request).await?;

    let transaction_collection = db.collection::<Transaction>("transactions");
    let account_collection = db.collection::<Account>("accounts");
    Account::user_owns(&account_collection, &user, &body.account).await?;

    let id = Transaction::insert(&transaction_collection, body.into_inner()).await?;
    let transaction = Transaction::find_one(&transaction_collection, id).await?;
    Ok(HttpResponse::Ok().json(transaction.response()))
}

#[post("/api/transaction/search")]
pub async fn get_many_route(
    db: web::Data<Database>,
    body: web::Json<SearchInput>,
    request: HttpRequest
) -> Result<HttpResponse, AppError> {
    let user = user_auth(&db, &request).await?;

    let transaction_collection = db.collection::<Transaction>("transactions");
    let account_collection = db.collection::<Account>("accounts");
    Account::user_owns(&account_collection, &user, &body.account).await?;

    let account = ObjectId::parse_str(body.account.clone())?;
    let transactions = Transaction::find(
        &transaction_collection,
        account,
        body.from.clone(),
        body.to.clone())
        .await?;
    let response_transactions: Vec<ResponseTransaction> = transactions
        .into_iter()
        .map(Transaction::response)
        .collect();

    Ok(HttpResponse::Ok().json(response_transactions))
}

#[put("/api/transaction")]
pub async fn update_route(
    db: web::Data<Database>,
    body: web::Json<UpdateInput>,
    request: HttpRequest
) -> Result<HttpResponse, AppError> {
    let user = user_auth(&db, &request).await?;

    let transaction_collection = db.collection::<Transaction>("transactions");

    Transaction::user_owns(
        &transaction_collection,
        &db.collection::<Account>("accounts"),
        ObjectId::parse_str(&body.id)?,
        user
    ).await?;

    let transaction = Transaction::update(
        &transaction_collection,
        ObjectId::parse_str(&body.id)?,
        body.data.clone(),
        body.date.clone()
    ).await?;

    Ok(HttpResponse::Ok().json(transaction.response()))
}
