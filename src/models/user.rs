use serde::{Serialize, Deserialize};
use bson::{oid::ObjectId, DateTime, doc};
use mongodb::Collection;

use crate::app_error::AppError;
use crate::models::account::ResponseAccount;
use crate::dto::user::CreateInput;

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub name: String,
    pub email: String,
    pub password_hash: String,
    pub password_salt: String,
    pub encryption_salt: String,
    pub created_at: bson::DateTime
}

#[derive(Serialize)]
pub struct ResponseUser {
    id: String,
    name: String,
    email: String,
    encryption_salt: String,
    created_at: i64,
    accounts: Option<Vec<ResponseAccount>>
}

impl User {
    pub async fn insert(collection: &Collection<User>, input: CreateInput) -> Result<ObjectId, AppError> {
        let user = User {
            id: ObjectId::new(),
            name: input.name,
            email: input.email,
            password_hash: input.password_hash,
            password_salt: input.password_salt,
            encryption_salt: input.encryption_salt,
            created_at: DateTime::now()
        };

        let result = collection.insert_one(user).await?;
        match result.inserted_id.as_object_id() {
            Some(oid) => Ok(oid),
            None => Err(AppError::InternalError("Internal server error".to_string()))
        }
    }

    pub async fn find_by_email(collection: &Collection<User>, email: &str) -> Result<User, AppError> {
        match collection.find_one(doc!{"email": email}).await {
            Ok(Some(u)) => Ok(u),
            Ok(None) => Err(AppError::invalid_input("No user with this email address")),
            Err(e) => Err(AppError::Database(e.into()))
        }
    }

    pub async fn find_by_id(collection: &Collection<User>, user_id: ObjectId) -> Result<User, AppError> {
        match collection.find_one(doc!{"_id": user_id}).await {
            Ok(Some(u)) => Ok(u),
            Ok(None) => Err(AppError::Auth),
            Err(e) => Err(AppError::Database(e.into()))
        }
    }

    pub fn response(self, accounts: Option<Vec<ResponseAccount>>) -> ResponseUser {
        ResponseUser {
            id: self.id.to_string(),
            name: self.name.to_string(),
            email: self.email.clone(),
            encryption_salt: self.encryption_salt.clone(),
            created_at: self.created_at.timestamp_millis(),
            accounts: accounts
        }
    }
}
