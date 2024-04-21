#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::_entities::{
    todos,
    todos::{ActiveModel, Model},
    users,
};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Params {
    pub text: String,
}

impl Params {
    fn update(&self, item: &mut ActiveModel) {
        item.text = Set(self.text.clone());
    }
}

async fn load_item(ctx: &AppContext, id: i32) -> Result<Model> {
    let item = todos::Entity::find_by_id(id).one(&ctx.db).await?;
    item.ok_or_else(|| Error::NotFound)
}

pub async fn list(auth: auth::JWT, State(ctx): State<AppContext>) -> Result<Json<Vec<Model>>> {
    let user = users::Model::find_by_pid(&ctx.db, &auth.claims.pid).await?;

    format::json(todos::Model::find_by_user_id(&ctx.db, user.id).await?)
}

pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Json<Model>> {
    let mut item = ActiveModel {
        ..Default::default()
    };
    params.update(&mut item);
    let item = item.insert(&ctx.db).await?;
    format::json(item)
}

pub async fn update(
    Path(id): Path<i32>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Json<Model>> {
    let item = load_item(&ctx, id).await?;
    let mut item = item.into_active_model();
    params.update(&mut item);
    let item = item.update(&ctx.db).await?;
    format::json(item)
}

pub async fn remove(Path(id): Path<i32>, State(ctx): State<AppContext>) -> Result<()> {
    load_item(&ctx, id).await?.delete(&ctx.db).await?;
    format::empty()
}

pub async fn get_one(Path(id): Path<i32>, State(ctx): State<AppContext>) -> Result<Json<Model>> {
    format::json(load_item(&ctx, id).await?)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("todos")
        .add("/", get(list))
        .add("/", post(add))
        .add("/:id", get(get_one))
        .add("/:id", delete(remove))
        .add("/:id", post(update))
}
