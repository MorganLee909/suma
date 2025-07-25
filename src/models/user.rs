use serde::{Serialize, Deserialize};
use bson::{oid::ObjectId, DateTime, doc};
use mongodb::{Collection, error::Error};

use crate::app_error::AppError;
use crate::models::account::ResponseAccount;
use crate::dto::user::CreateInput;

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub email: String,
    pub password_hash: String,
    pub password_salt: String,
    pub created_at: bson::DateTime
}

#[derive(Serialize)]
pub struct ResponseUser {
    id: String,
    email: String,
    created_at: i64,
    accounts: Option<Vec<ResponseAccount>>
}

impl User {
    pub async fn insert(collection: &Collection<User>, input: CreateInput) -> Result<(), Error> {
        let user = User {
            id: ObjectId::new(),
            email: input.email,
            password_hash: input.password_hash,
            password_salt: input.password_salt,
            created_at: DateTime::now()
        };

        collection.insert_one(user).await?;
        Ok(())
    }

    pub async fn find_by_email(collection: &Collection<User>, email: &str) -> Result<User, AppError> {
        match collection.find_one(doc!{"email": email}).await {
            Ok(Some(u)) => Ok(u),
            Ok(None) => Err(AppError::invalid_input("No user with this email address")),
            Err(e) => Err(AppError::Database(e.into()))
        }
    }

    pub async fn find_by_id(collection: &Collection<User>, user_id: String) -> Result<User, AppError> {
        let object_id = ObjectId::parse_str(user_id)
            .map_err(|_| AppError::invalid_input("Invalid user ID"))?;
        match collection.find_one(doc!{"_id": object_id}).await {
            Ok(Some(u)) => Ok(u),
            Ok(None) => Err(AppError::Auth),
            Err(e) => Err(AppError::Database(e.into()))
        }
    }

    pub fn response(self, accounts: Option<Vec<ResponseAccount>>) -> ResponseUser {
        ResponseUser {
            id: self.id.to_string(),
            email: self.email.clone(),
            created_at: self.created_at.timestamp_millis(),
            accounts: accounts
        }
    }
}
