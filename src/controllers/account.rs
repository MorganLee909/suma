use actix_web::{post, web, HttpResponse};

#[post("/api/account")]
pub async fn create_route(
    db: web::Data<Database>,
    payload: web::Json<NewUserInput>
) -> Result<HttpResponse, AppError> {
}
