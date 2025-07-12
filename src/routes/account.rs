use actix_web::web;
use crate::controllers::user::{
    create_route
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(create_route);
}
