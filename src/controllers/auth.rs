use axum::{http::StatusCode, response::Response};
use loco_rs::model::ModelError;
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::json;

use crate::{
    mailers::auth::AuthMailer,
    models::{
        _entities::users,
        users::{AuthSignInParams, AuthSignUpParams},
    },
    views::auth::AuthedUserResponse,
    views::common::ErrorResponse,
};

#[derive(Debug, Deserialize, Serialize)]
pub struct VerifyParams {
    pub token: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ForgotParams {
    pub email: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ResetParams {
    pub token: String,
    pub password: String,
}

/// Creates a new user with the given parameters and sends a
/// welcome email to the user
async fn sign_up(
    State(ctx): State<AppContext>,
    Json(params): Json<AuthSignUpParams>,
) -> Result<Response> {
    let res = users::Model::create_with_password(&ctx.db, &params).await;

    // Translate the email to lower case. This ensures that when checking if an email is already
    // registered, it can not be re-used by supplying a variation that differs only in the case
    // of the letters.
    let email_lc = &params.email.to_lowercase();

    let user = match res {
        Ok(user) => user,
        Err(err) => {
            tracing::info!(
                message = err.to_string(),
                user_email = &email_lc,
                "auth::register failed to register user",
            );

            match err {
                // TODO Consider that returning err_auth_user_with_this_email_already_exists could allow to check if
                // a certain email already exists in the system. That said, returning any error is pretty much an
                // indication that the email already exists, and if they try it a few times and get an 'unknown'
                // error, it is a dead giveaway that the email is in use.
                ModelError::EntityAlreadyExists => {
                    return Ok((
                        StatusCode::CONFLICT,
                        Json(json!(ErrorResponse::new(
                            &String::from("err_auth_user_with_this_email_already_exists"),
                            &String::from("User with this email is already registered.")
                        ))),
                    )
                        .into_response());
                }
                _ => {
                    return Ok((
                        StatusCode::INTERNAL_SERVER_ERROR,
                        Json(json!(ErrorResponse::new(
                            &String::from("err_auth_could_not_create_user"),
                            &String::from("Could not create user. Please try again.")
                        ))),
                    )
                        .into_response());
                }
            };
        }
    };

    let user = user
        .into_active_model()
        .set_email_verification_sent(&ctx.db)
        .await?;

    AuthMailer::send_welcome(&ctx, &user).await?;

    let jwt_secret = ctx.config.get_jwt_config()?;

    let token = user
        .generate_jwt(&jwt_secret.secret, &jwt_secret.expiration)
        .or_else(|_| unauthorized("unauthorized!"))?;

    Ok((
        StatusCode::OK,
        Json(json!(AuthedUserResponse::new(&user, &token))),
    )
        .into_response())
}

/// Verify register user. if the user not verified his email, he can't sign in to
/// the system.
async fn verify(
    State(ctx): State<AppContext>,
    Json(params): Json<VerifyParams>,
) -> Result<Response> {
    let user_result = users::Model::find_by_verification_token(&ctx.db, &params.token).await;

    match user_result {
        Ok(user) => {
            if user.email_verified_at.is_some() {
                tracing::info!(pid = user.pid.to_string(), "user already verified");
            } else {
                let active_model = user.into_active_model();
                let user = active_model.verified(&ctx.db).await?;
                tracing::info!(pid = user.pid.to_string(), "user verified");
            }

            return Ok((StatusCode::OK, Json(json!(()))).into_response());
        }
        Err(err) => {
            tracing::info!(
                message = err.to_string(),
                token = &params.token,
                "auth::verify failed to verify with token",
            );

            match err {
                ModelError::EntityNotFound => {
                    return Ok((
                        StatusCode::CONFLICT,
                        Json(json!(ErrorResponse::new(
                            &String::from("err_auth_verify_token_not_found"),
                            &String::from(
                                "Verification code could not be found. Re-enter or re-send."
                            )
                        ))),
                    )
                        .into_response());
                }
                _ => {
                    return Ok((
                        StatusCode::INTERNAL_SERVER_ERROR,
                        Json(json!(ErrorResponse::new(
                            &String::from("err_auth_could_not_verify_user"),
                            &String::from("Email could not be verified. Please try again.")
                        ))),
                    )
                        .into_response());
                }
            };
        }
    };
}

/// In case the user forgot his password this endpoints generate a forgot token
/// and send email to the user. In case the email not found in our DB, we are
/// returning a valid request for for security reasons (not exposing users DB
/// list).
async fn forgot(
    State(ctx): State<AppContext>,
    Json(params): Json<ForgotParams>,
) -> Result<Json<()>> {
    let Ok(user) = users::Model::find_by_email(&ctx.db, &params.email).await else {
        // we don't want to expose our users email. if the email is invalid we still
        // returning success to the caller
        return format::json(());
    };

    let user = user
        .into_active_model()
        .set_forgot_password_sent(&ctx.db)
        .await?;

    AuthMailer::forgot_password(&ctx, &user).await?;

    format::json(())
}

/// In case the user did not receive their welcome email re-send the welcome
/// email to the user. In case the email not found in our DB, we are
/// returning a valid request for for security reasons (not exposing users DB
/// list).
async fn resend(
    State(ctx): State<AppContext>,
    Json(params): Json<ForgotParams>,
) -> Result<Json<()>> {
    let Ok(user) = users::Model::find_by_email(&ctx.db, &params.email).await else {
        // we don't want to expose our users email. if the email is invalid we still
        // returning success to the caller
        return format::json(());
    };

    let user = user
        .into_active_model()
        .set_forgot_password_sent(&ctx.db)
        .await?;

    AuthMailer::send_welcome(&ctx, &user).await?;

    format::json(())
}

/// Reset user password by the given parameters
async fn reset(State(ctx): State<AppContext>, Json(params): Json<ResetParams>) -> Result<Json<()>> {
    let Ok(user) = users::Model::find_by_reset_token(&ctx.db, &params.token).await else {
        // we don't want to expose our users email. if the email is invalid we still
        // returning success to the caller
        tracing::info!("reset token not found");

        return format::json(());
    };
    user.into_active_model()
        .reset_password(&ctx.db, &params.password)
        .await?;

    format::json(())
}

/// Creates a user record and returns authed user
async fn sign_in(
    State(ctx): State<AppContext>,
    Json(params): Json<AuthSignInParams>,
) -> Result<Response> {
    let Ok(user) = users::Model::find_by_email(&ctx.db, &params.email).await else {
        return Ok((
            StatusCode::UNAUTHORIZED,
            Json(json!(ErrorResponse::new(
                &String::from("err_auth_user_not_found"),
                &String::from("Could not sign in with this email and password.")
            ))),
        )
            .into_response());
    };

    let valid = user.verify_password(&params.password);

    if !valid {
        return Ok((
            StatusCode::UNAUTHORIZED,
            Json(json!(ErrorResponse::new(
                &String::from("err_auth_incorrect_password"),
                &String::from("Could not sign in with this email and password.")
            ))),
        )
            .into_response());
    }

    let jwt_secret = ctx.config.get_jwt_config()?;

    let token = user
        .generate_jwt(&jwt_secret.secret, &jwt_secret.expiration)
        .or_else(|_| unauthorized("unauthorized!"))?;

    Ok((
        StatusCode::OK,
        Json(json!(AuthedUserResponse::new(&user, &token))),
    )
        .into_response())
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("auth")
        .add("/sign-up", post(sign_up))
        .add("/verify", post(verify))
        .add("/sign-in", post(sign_in))
        .add("/forgot", post(forgot))
        .add("/resend", post(resend))
        .add("/reset", post(reset))
}
