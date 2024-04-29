use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                table_auto(HorseColors::Table)
                    .col(pk_auto(HorseColors::Id))
                    .col(string(HorseColors::Name))
                    .col(string(HorseColors::Description))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(HorseColors::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum HorseColors {
    Table,
    Id,
    Name,
    Description,
}
