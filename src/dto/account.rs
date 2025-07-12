use serde::Deserialize;

#[derive(Deserialize)]
pub struct CreateInput {
    pub user: String,
    pub data: String,
}
