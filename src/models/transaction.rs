use serde::{Serialize, Deserialize};
use mongodb::Collection;
use bson::{doc, Document, oid::ObjectId};
use futures::stream::TryStreamExt;

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

    pub fn response(self) -> ResponseTransaction {
        ResponseTransaction {
            id: self.id.to_hex(),
            account: self.account.to_hex(),
            data: self.data.clone(),
            date: self.date.clone()
        }
    }
}
