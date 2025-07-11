use actix_web::{post, web, HttpResponse, Responder};
use mongodb::{bson::doc, Database};
use crate::models::user::{User, NewUserInput};
use regex::Regex;

#[post("/api/user")]
pub async fn create(
    db: web::Data<Database>,
    payload: web::Json<NewUserInput>
) -> impl Responder {
    let user_collection = db.collection::<User>("users");
    let email = payload.email.to_lowercase();
    let email_regex: Regex = Regex::new(r#"^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}(\.[0-9]{1,3}){3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$"#).unwrap();

    if !email_regex.is_match(&email) {
        return HttpResponse::BadRequest().body("Invalid email");
    }

    match user_collection.find_one(doc!{"email": email}, None).await {
        Ok(None) => {},
        Ok(Some(_)) => return HttpResponse::BadRequest().body("User with this email already exists"),
        Err(_) => return HttpResponse::InternalServerError().body("Internal server error")
    }

    match User::insert(&user_collection, payload.into_inner()).await {
        Ok(_) => HttpResponse::Ok().body("{'success': 'true'}"),
        Err(e) => {
            eprintln!("Error: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to create user")
        }
    }
}
