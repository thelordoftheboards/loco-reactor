use super::_entities::horses::{self, ActiveModel, Model};
use sea_orm::entity::prelude::*;

impl ActiveModelBehavior for ActiveModel {
    // extend activemodel below (keep comment for generators)
}

impl super::_entities::horses::Model {
    /// finds all horses for a user
    ///
    /// # Errors
    ///
    /// DB query error
    pub async fn find_by_user_id(
        db: &DatabaseConnection,
        user_id: i32,
    ) -> std::result::Result<Vec<Model>, sea_orm::DbErr> {
        horses::Entity::find()
            .filter(horses::Column::UserId.eq(user_id))
            .all(db)
            .await
    }
}
