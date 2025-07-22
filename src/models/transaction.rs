use serde::{Serialize, Deserialize};
use mongodb::Collection;
use bson::oid::ObjectId;

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
        account: ObjectId
    ) -> Result<(), AppError> {
        let transaction = Transaction {
            id: ObjectId::new(),
            account: ObjectId::parse_str(input.account)?,
            data: input.data,
            date: input.date
        };

        collection.insert_one(transaction, None).await?;
        Ok(())
    }
}
