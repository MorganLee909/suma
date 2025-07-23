use serde::Deserialize;

#[derive(Deserialize)]
pub struct CreateInput {
    pub data: String
}

#[derive(Deserialize)]
pub struct UpdateInput {
    pub id: String,
    pub data: String
}
