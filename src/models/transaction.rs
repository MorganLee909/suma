use serde::{Serialize, Deserialize};
use mongodb::Collection;
use bson::{doc, oid::ObjectId};

use crate::app_error::AppError;
use crate::dto::transaction::CreateInput;

#[derive(Serialize, Deserialize)]
pub struct Transaction {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub account: ObjectId,
    pub data: String,
    pub date: String
}

#[derive(Serialize, Deserialize)]
pub struct ResponseTransaction {
    pub id: String,
    pub account: String,
    pub data: String,
    pub date: String
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
            date: input.date
        };

        let insert_one_result = collection.insert_one(transaction, None).await?;
        Ok(insert_one_result.inserted_id.as_object_id().unwrap())
    }

    pub async fn find_one(collection: &Collection<Transaction>, transaction_id: ObjectId) -> Result<Transaction, AppError> {
        match collection.find_one(doc!{"_id": transaction_id}, None).await {
            Ok(Some(a)) => Ok(a),
            Ok(None) => Err(AppError::invalid_input("No transaction with that ID")),
            Err(e) => Err(AppError::Database(e.into()))
        }
    }

    pub fn response(self) -> ResponseTransaction {
        ResponseTransaction {
            id: self.id.to_hex(),
            account: self.account.to_hex(),
            data: self.data.clone(),
            date: self.date.clone()
        }
    }
}
