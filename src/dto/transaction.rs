use serde::Deserialize;

#[derive(Deserialize)]
pub struct CreateInput {
    pub account: String,
    pub date: String,
    pub data: String
}

#[derive(Deserialize)]
pub struct SearchInput {
    pub account: String,
    pub from: Option<String>,
    pub to: Option<String>
}
