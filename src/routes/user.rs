use actix_web::web;
use crate::controllers::user::{
    create,
    login
};

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(create);
    cfg.service(login);
}
