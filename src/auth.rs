use mongodb::Database;
use actix_web::{HttpRequest, cookie::Cookie};

use crate::models::user::User;
use crate::app_error::AppError;

pub async fn user_auth(
    db: &Database,
    req: &HttpRequest
) -> Result<Cookie, AppError> {
    let user_id = req.cookie("user")?.into_owned().value();
    let user_collection = db.collection::<User>("users");
    User::find_by_id(&user_collection, user_id).await?
}
