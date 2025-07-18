use actix_web::web;
use crate::controllers::user::{
    create_route,
    login_route,
    logout_route
};

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(create_route);
    cfg.service(login_route);
    cfg.service(logout_route);
}
