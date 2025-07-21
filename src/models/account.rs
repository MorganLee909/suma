use serde::{Serialize, Deserialize};
use bson::{oid::ObjectId, DateTime, Bson, doc};
use mongodb::Collection;
use futures::stream::TryStreamExt;

use crate::app_error::AppError;
use crate::dto::account::CreateInput;
use crate::models::user::User;

#[derive(Serialize, Deserialize)]
pub struct Account {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub _id: Option<ObjectId>,
    pub user: ObjectId,
    pub data: String,
    pub created_at: DateTime
}

#[derive(Serialize, Deserialize)]
pub struct ResponseAccount {
    pub id: String,
    pub data: String,
    pub created_at: i64
}

impl Account {
    pub async fn insert(collection: &Collection<Account>, input: CreateInput, user: User) -> Result<ObjectId, AppError> {
        let object_id = match user._id {
            Some(oid) => Ok(oid),
            None => Err(AppError::Auth)
        };

        let account = Account {
            _id: None,
            user: object_id?,
            data: input.data,
            created_at: DateTime::now()
        };

        let result = collection
            .insert_one(account, None)
            .await?;

        match result.inserted_id {
            Bson::ObjectId(oid) => Ok(oid),
            _ => Err(AppError::InternalError("Invalid Data".to_string()))
        }
    }

    pub async fn find_by_user(collection: &Collection<Account>, user_id: ObjectId) -> Result<Vec<Account>, AppError> {
        Ok(collection
            .find(doc!{"_id": user_id}, None)
            .await?
            .try_collect::<Vec<_>>()
            .await?)
    }

    pub async fn find_by_id(collection: &Collection<Account>, account_id: ObjectId) -> Result<Account, AppError> {
        match collection.find_one(doc!{"_id": account_id}, None).await {
            Ok(Some(a)) => Ok(a),
            Ok(None) => Err(AppError::invalid_input("No account with that ID")),
            Err(e) => Err(AppError::Database(e.into()))
        }
    }

    pub fn response(self) -> ResponseAccount {
        ResponseAccount {
            id: self._id.unwrap().to_string(),
            data: self.data.clone(),
            created_at: self.created_at.timestamp_millis()
        }
    }
}
