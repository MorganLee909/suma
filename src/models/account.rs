use serde::{Serialize, Deserialize};
use bson::{oid::ObjectId, DateTime};

#[derive(Serialize, Deserialize)]
pub struct Account {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub _id: Option<ObjectId>,
    pub user: ObjectId,
    pub data: String,
    pub created_date: bson::DateTime
}
