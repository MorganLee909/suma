use mongodb::Database;
use actix_web::{HttpRequest};
use bson::oid::ObjectId;

use crate::models::user::User;
use crate::app_error::AppError;

pub async fn user_auth(
    db: &Database,
    req: &HttpRequest
) -> Result<User, AppError> {
    let cookie = req.cookie("user").ok_or(AppError::Auth)?;
    let user_id = cookie.value();
    let object_id = ObjectId::parse_str(user_id)?;
    let user_collection = db.collection::<User>("users");
    Ok(User::find_by_id(&user_collection, object_id).await?)
}
