use actix_web::{get, HttpResponse, Responder, web};
use actix_files::NamedFile;
use std::path::PathBuf;
use crate::HTML;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(landing_page);
}

#[get("/")]
async fn landing_page() -> impl Responder {
    let html = HTML.get().expect("No HTML");
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(html.clone())
}
