use serde::Deserialize;

#[derive(Deserialize)]
pub struct CreateInput {
    pub account: String,
    pub date: String,
    pub data: String
}
