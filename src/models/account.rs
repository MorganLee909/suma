use serde::{Serialize, Deserialize};
use bson::{oid::ObjectId, DateTime, Bson, doc};
use mongodb::{Collection, options::ReturnDocument};
use futures::stream::TryStreamExt;

use crate::app_error::AppError;
use crate::dto::account::CreateInput;
use crate::models::user::User;

#[derive(Debug, Serialize, Deserialize)]
pub struct Account {
    #[serde(rename = "_id")]
    pub id: ObjectId,
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
        let account = Account {
            id: ObjectId::new(),
            user: user.id,
            data: input.data,
            created_at: DateTime::now()
        };

        let result = collection.insert_one(account).await?;

        match result.inserted_id {
            Bson::ObjectId(oid) => Ok(oid),
            _ => Err(AppError::InternalError("Invalid Data".to_string()))
        }
    }

    pub async fn find_by_user(collection: &Collection<Account>, user_id: ObjectId) -> Result<Vec<Account>, AppError> {
        Ok(collection
            .find(doc!{"user": user_id})
            .await?
            .try_collect::<Vec<_>>()
            .await?)
    }

    pub async fn find_by_id(collection: &Collection<Account>, account_id: ObjectId) -> Result<Account, AppError> {
        match collection.find_one(doc!{"_id": account_id}).await {
            Ok(Some(a)) => Ok(a),
            Ok(None) => Err(AppError::invalid_input("No account with that ID")),
            Err(e) => Err(AppError::Database(e.into()))
        }
    }

    pub async fn update(
        collection: &Collection<Account>,
        id: ObjectId,
        data: &String
    ) -> Result<Account, AppError> {
        let filter = doc! {"_id": id};
        let update = doc! {"$set": {"data": data}};

        let result = collection
            .find_one_and_update(filter, update)
            .return_document(ReturnDocument::After)
            .await?;

        match result {
            Some(a) => Ok(a),
            None => Err(AppError::InvalidInput("No account with this ID".to_string()))
        }
    }

    pub async fn user_owns(
        coll: &Collection<Account>,
        user: &User,
        account: &String
    ) -> Result<(), AppError> {
        let id = ObjectId::parse_str(account)?;
        let account = Account::find_by_id(coll, id).await?;
        if user.id != account.user {
            return Err(AppError::Auth);
        }
        Ok(())
    }

    pub fn response(self) -> ResponseAccount {
        ResponseAccount {
            id: self.id.to_string(),
            data: self.data.clone(),
            created_at: self.created_at.timestamp_millis()
        }
    }
}
