#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]

use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::_entities::{
    horses,
    horses::{ActiveModel, Model},
    users,
};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Params {
    pub id: i32,
    pub given_name: String,
    pub gender_id: i32,
    pub color_id: i32,
}

impl Params {
    fn update(&self, item: &mut ActiveModel) {
        item.id = Set(self.id.clone());
        item.given_name = Set(self.given_name.clone());
        item.gender_id = Set(self.gender_id.clone());
        item.color_id = Set(self.color_id.clone());
    }
}

async fn load_item(ctx: &AppContext, id: i32) -> Result<Model> {
    let item = horses::Entity::find_by_id(id).one(&ctx.db).await?;
    item.ok_or_else(|| Error::NotFound)
}

pub async fn list(auth: auth::JWT, State(ctx): State<AppContext>) -> Result<Response> {
    let user = users::Model::find_by_pid(&ctx.db, &auth.claims.pid).await?;

    format::json(horses::Model::find_by_user_id(&ctx.db, user.id).await?)
}

pub async fn add(
    auth: auth::JWT,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let user = users::Model::find_by_pid(&ctx.db, &auth.claims.pid).await?;
    let mut item = ActiveModel {
        ..Default::default()
    };
    params.update(&mut item);
    item.user_id = sea_orm::ActiveValue::Set(user.id);
    item.id = sea_orm::ActiveValue::NotSet; // Auto number will give new id
    let item = item.insert(&ctx.db).await?;
    format::json(item)
}

pub async fn update(
    auth: auth::JWT,
    Path(id): Path<i32>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let _user = users::Model::find_by_pid(&ctx.db, &auth.claims.pid).await?;
    // TODO Make sure horse belongs to user

    let item = load_item(&ctx, id).await?;
    let mut item = item.into_active_model();
    params.update(&mut item);
    let item = item.update(&ctx.db).await?;
    format::json(item)
}

pub async fn remove(
    auth: auth::JWT,
    Path(id): Path<i32>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let _user = users::Model::find_by_pid(&ctx.db, &auth.claims.pid).await?;
    // TODO Make sure horse belongs to user

    load_item(&ctx, id).await?.delete(&ctx.db).await?;
    format::empty()
}

pub async fn get_one(
    auth: auth::JWT,
    Path(id): Path<i32>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let _user = users::Model::find_by_pid(&ctx.db, &auth.claims.pid).await?;
    // TODO Make sure horse belongs to user

    format::json(load_item(&ctx, id).await?)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("horses")
        .add("/", get(list))
        .add("/", post(add))
        .add("/:id", get(get_one))
        .add("/:id", delete(remove))
        .add("/:id", post(update))
}
