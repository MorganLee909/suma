use serde::Deserialize;

#[derive(Deserialize)]
pub struct LoginInput {
    pub email: String,
    pub password_hash: String,
    pub password_salt: String,
}

#[derive(Deserialize)]
pub struct CreateInput {
    pub name: String,
    pub email: String,
    pub password_hash: String,
    pub password_salt: String,
    pub encryption_salt: String
}
