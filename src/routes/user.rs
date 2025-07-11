use actix_web::web;
use crate::controllers::user::create;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(create);
}
