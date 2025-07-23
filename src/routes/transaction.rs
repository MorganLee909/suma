use actix_web::web;

use crate::controllers::transaction::{
    create_route,
    get_many_route,
    update_route
};

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(create_route);
    cfg.service(get_many_route);
    cfg.service(update_route);
}
