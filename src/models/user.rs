use serde::{Serialize, Deserialize};
use bson::{oid::ObjectId, DateTime, doc};
use mongodb::{Collection, error::Error};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub _id: Option<ObjectId>,
    pub email: String,
    pub password_hash: String,
    pub password_salt: String,
    pub created_at: bson::DateTime
}

#[derive(Debug, Deserialize)]
pub struct NewUserInput {
    pub email: String,
    pub password_hash: String,
    pub password_salt: String
}

impl User {
    pub async fn insert(collection: &Collection<User>, input: NewUserInput) -> Result<(), Error> {
        let user = User {
            _id: None,
            email: input.email,
            password_hash: input.password_hash,
            password_salt: input.password_salt,
            created_at: DateTime::now()
        };

        collection.insert_one(user, None).await?;
        Ok(())
    }
}
