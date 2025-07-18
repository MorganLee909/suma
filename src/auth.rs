use mongodb::Database;
use actix_web::{HttpRequest};

use crate::models::user::User;
use crate::app_error::AppError;

pub async fn user_auth(
    db: &Database,
    req: &HttpRequest
) -> Result<User, AppError> {
    let user_id = req.cookie("user")
        .ok_or(AppError::Auth)?
        .value()
        .to_string();
    let user_collection = db.collection::<User>("users");
    Ok(User::find_by_id(&user_collection, user_id).await?)
}
