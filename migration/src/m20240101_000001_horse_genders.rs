use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                table_auto(HorseGenders::Table)
                    .col(pk_auto(HorseGenders::Id))
                    .col(string(HorseGenders::Name))
                    .col(string(HorseGenders::Description))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(HorseGenders::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum HorseGenders {
    Table,
    Id,
    Name,
    Description,
}
