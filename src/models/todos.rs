use super::_entities::todos::{self, ActiveModel, Model};
use sea_orm::entity::prelude::*;

impl ActiveModelBehavior for ActiveModel {
    // extend activemodel below (keep comment for generators)
}

impl super::_entities::todos::Model {
    /// finds all todos for a user
    ///
    /// # Errors
    ///
    /// DB query error
    pub async fn find_by_user_id(
        db: &DatabaseConnection,
        user_id: i32,
    ) -> std::result::Result<Vec<Model>, sea_orm::DbErr> {
        todos::Entity::find()
            .filter(todos::Column::UserId.eq(user_id))
            .all(db)
            .await
    }
}
