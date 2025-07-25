use actix_web::{App, HttpServer, web};
use std::sync::OnceLock;
use mongodb::{Client, Database};

mod routes;
mod models;
mod controllers;
mod dto;
mod app_error;
mod auth;

pub static HTML: OnceLock<String> = OnceLock::new();

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db = connect_db("mongodb://localhost:27017", "suma").await;

    let html = std::fs::read_to_string("src/views/build.html")
        .expect("Failed to read HTML");
    HTML.set(html).expect("Failed to set global HTML");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(db.clone()))
            .configure(routes::other::config)
            .configure(routes::user::config)
            .configure(routes::account::config)
            .configure(routes::transaction::config)
    })
        .bind(("127.0.0.1", 8000))?
        .run()
        .await
}

pub async fn connect_db(uri: &str, db_name: &str) -> Database {
    let client = Client::with_uri_str(uri).await.expect("Failed to connect to database");
    client.database(db_name)
}
