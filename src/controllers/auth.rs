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
pub struct AuthVerifyParams {
    pub token: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct AuthForgotParams {
    pub email: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct AuthResetParams {
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
                ModelError::EntityAlreadyExists => {
                    return Ok((
                        StatusCode::CONFLICT,
                        Json(json!(ErrorResponse::new(&String::from(
                            "err_auth_user_with_this_email_already_exists"
                        )))),
                    )
                        .into_response());
                }
                _ => {
                    return Ok((
                        StatusCode::INTERNAL_SERVER_ERROR,
                        Json(json!(ErrorResponse::new(&String::from(
                            "err_auth_could_not_create_user"
                        )))),
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

/// Verify register user. if the user not verified his email, he can't login to
/// the system.
async fn verify(
    State(ctx): State<AppContext>,
    Json(params): Json<AuthVerifyParams>,
) -> Result<Json<()>> {
    let user = users::Model::find_by_verification_token(&ctx.db, &params.token).await?;

    if user.email_verified_at.is_some() {
        tracing::info!(pid = user.pid.to_string(), "user already verified");
    } else {
        let active_model = user.into_active_model();
        let user = active_model.verified(&ctx.db).await?;
        tracing::info!(pid = user.pid.to_string(), "user verified");
    }

    format::json(())
}

/// In case the user forgot his password this endpoints generate a forgot token
/// and send email to the user. In case the email not found in our DB, we are
/// returning a valid request for for security reasons (not exposing users DB
/// list).
async fn forgot(
    State(ctx): State<AppContext>,
    Json(params): Json<AuthForgotParams>,
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

/// Reset user password by the given parameters
async fn reset(
    State(ctx): State<AppContext>,
    Json(params): Json<AuthResetParams>,
) -> Result<Json<()>> {
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

/// Creates a user login and returns authed user
async fn sign_in(
    State(ctx): State<AppContext>,
    Json(params): Json<AuthSignInParams>,
) -> Result<Response> {
    let Ok(user) = users::Model::find_by_email(&ctx.db, &params.email).await else {
        return Ok((
            StatusCode::UNAUTHORIZED,
            Json(json!(ErrorResponse::new(&String::from(
                "err_auth_user_not_found"
            )))),
        )
            .into_response());
    };

    let valid = user.verify_password(&params.password);

    if !valid {
        return Ok((
            StatusCode::UNAUTHORIZED,
            Json(json!(ErrorResponse::new(&String::from(
                "err_auth_incorrect_password"
            )))),
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
        .add("/reset", post(reset))
}
