use serde::{Serialize, Deserialize};

#[derive(Deserialize)]
pub struct CreateInput {
    pub data: String
}

#[derive(Serialize, Deserialize)]
pub struct ResponseAccount {
    pub data: String,
    pub created_at: i64
}
