use actix_web::web;
use crate::controllers::account::{
    create_route,
    update_route
};

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(create_route);
    cfg.service(update_route);
}
