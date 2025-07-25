use actix_web::{get, HttpResponse, Responder, web, Error};
use actix_files::NamedFile;
use crate::HTML;
use std::path::PathBuf;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(landing_page);
    cfg.service(landing_page_dev);
    cfg.service(svg_logo);
    cfg.service(png_logo);
}

#[get("/")]
async fn landing_page() -> impl Responder {
    let html = HTML.get().expect("No HTML");
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(html.clone())
}

#[get("/dev")]
async fn landing_page_dev() -> Result<NamedFile, Error> {
    let path: PathBuf = PathBuf::from("src/views/build.html");
    Ok(NamedFile::open(path)?)
}

#[get("/logo.svg")]
async fn svg_logo() -> Result<NamedFile, Error> {
    let path: PathBuf = PathBuf::from("src/views/logo.svg");
    Ok(NamedFile::open(path)?)
}

#[get("/logo.png")]
async fn png_logo() -> Result<NamedFile, Error> {
    let path: PathBuf = PathBuf::from("src/views/logo.png");
    Ok(NamedFile::open(path)?)
}
