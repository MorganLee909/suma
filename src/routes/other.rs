use actix_web::{get, HttpResponse, Responder, web};
use actix_files::NamedFile;
use std::path::PathBuf;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(landing_page);
}

#[get("/")]
async fn landing_page() -> Result<NamedFile, actix_web::Error> {
    let mut path: PathBuf = std::env::current_dir()?;
    path.push("src/build.html");
    Ok(NamedFile::open(path)?)
}
