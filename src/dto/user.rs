use serde::{Serialize, Deserialize};

#[derive(Deserialize)]
pub struct Login {
    pub email: String,
    pub password_hash: String,
    pub password_salt: String
}

#[derive(Serialize, Deserialize)]
pub struct ResponseUser {
    pub id: String,
    pub email: String,
    pub created_at: i64
}
