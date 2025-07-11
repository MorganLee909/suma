use actix_web::{post, web, HttpResponse, Responder};
use mongodb::Database;
use crate::models::user::{User, NewUserInput};

#[post("/api/user")]
pub async fn create(
    db: web::Data<Database>,
    payload: web::Json<NewUserInput>
) -> impl Responder {
    let users = db.collection::<User>("users");

    match User::insert(&users, payload.into_inner()).await {
        Ok(id) => HttpResponse::Ok().body("{'success': 'true'}"),
        Err(e) => {
            eprintln!("Error: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to create user")
        }
    }
}
