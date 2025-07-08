use actix_web::{App, HttpServer};
use std::sync::OnceLock;

mod routes;

pub static HTML: OnceLock<String> = OnceLock::new();

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let html = std::fs::read_to_string("src/views/build.html")
        .expect("Failed to read HTML");
    HTML.set(html).expect("Failed to set global HTML");

    HttpServer::new(|| {
        App::new()
            .configure(routes::other::config)
    })
        .bind(("127.0.0.1", 8000))?
        .run()
        .await
}
