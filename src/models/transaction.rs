use serde::{Serialize, Deserialize};
use mongodb::{Collection, options::ReturnDocument};
use bson::{doc, Document, oid::ObjectId};
use futures::stream::TryStreamExt;

use crate::app_error::AppError;
use crate::dto::transaction::CreateInput;
use crate::models::account::Account;
use crate::models::user::User;

#[derive(Serialize, Deserialize)]
pub struct Transaction {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub account: ObjectId,
    pub data: String,
    pub date: String,
    pub iv: String
}

#[derive(Serialize, Deserialize)]
pub struct ResponseTransaction {
    pub id: String,
    pub account: String,
    pub data: String,
    pub date: String,
    pub iv: String
}

impl Transaction {
    pub async fn insert(
        collection: &Collection<Transaction>,
        input: CreateInput,
    ) -> Result<ObjectId, AppError> {
        let transaction = Transaction {
            id: ObjectId::new(),
            account: ObjectId::parse_str(input.account)?,
            data: input.data,
            date: input.date,
            iv: input.iv
        };

        let insert_one_result = collection.insert_one(transaction).await?;
        Ok(insert_one_result.inserted_id.as_object_id().unwrap())
    }

    pub async fn find_one(collection: &Collection<Transaction>, transaction_id: ObjectId) -> Result<Transaction, AppError> {
        match collection.find_one(doc!{"_id": transaction_id}).await {
            Ok(Some(a)) => Ok(a),
            Ok(None) => Err(AppError::invalid_input("No transaction with that ID")),
            Err(e) => Err(AppError::Database(e.into()))
        }
    }

    pub async fn find(
        collection: &Collection<Transaction>,
        account: ObjectId,
        from: Option<String>,
        to: Option<String>
    ) -> Result<Vec<Transaction>, AppError> {
        let mut filter = doc! {"account": account};
        let mut date_filter = Document::new();

        if let Some(f) = from {date_filter.insert("$gte", f);}
        if let Some(t) = to {date_filter.insert("$lte", t);}
        if !date_filter.is_empty() {filter.insert("date", date_filter);}

        Ok(collection
            .find(filter)
            .await?
            .try_collect::<Vec<_>>()
            .await?)
    }

    pub async fn user_owns(
        transaction_collection: &Collection<Transaction>,
        account_collection: &Collection<Account>,
        id: ObjectId,
        user: User
    ) -> Result<(), AppError> {
        let transaction = match transaction_collection.find_one(doc!{"_id": id}).await {
            Ok(Some(t)) => t,
            Ok(None) => return Err(AppError::InvalidInput("Transaction with this ID doesn't exist".to_string())),
            Err(e) => return Err(AppError::Database(e.into()))
        };

        let account = match account_collection.find_one(doc!{"_id": transaction.account}).await {
            Ok(Some(a)) => a,
            Ok(None) => return Err(AppError::InternalError("Internal server error".to_string())),
            Err(e) => return Err(AppError::Database(e.into()))
        };

        if user.id != account.user {return Err(AppError::Auth);}

        Ok(())
    }

    pub async fn update(
        collection: &Collection<Transaction>,
        id: ObjectId,
        data: Option<String>,
        date: Option<String>
    ) -> Result<Transaction, AppError> {
        let filter = doc!{"_id": id};
        let mut set = Document::new();

        if let Some(d) = data {set.insert("data", d);}
        if let Some(d) = date {set.insert("date", d);}

        if !set.is_empty() {
            let result = collection
                .find_one_and_update(filter, doc!{"$set": set})
                .return_document(ReturnDocument::After)
                .await?;

            match result {
                Some(a) => Ok(a),
                None => Err(AppError::InvalidInput("No account with this ID".to_string()))
            }
        } else {
            Err(AppError::InvalidInput("Nothing to update".to_string()))
        }
    }

    pub async fn delete(collection: &Collection<Transaction>, id: ObjectId) -> Result<(), AppError> {
        collection.delete_one(doc!{"_id": id}).await?;
        Ok(())
    }

    pub fn response(self) -> ResponseTransaction {
        ResponseTransaction {
            id: self.id.to_hex(),
            account: self.account.to_hex(),
            data: self.data.clone(),
            date: self.date.clone(),
            iv: self.iv.clone()
        }
    }
}
