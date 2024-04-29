use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                table_auto(Horses::Table)
                    .col(pk_auto(Horses::Id))
                    .col(string(Horses::GivenName))
                    .col(integer(Horses::UserId))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-horses-users")
                            .from(Horses::Table, Horses::UserId)
                            .to(Users::Table, Users::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(integer(Horses::GenderId))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-horses-horse-genders")
                            .from(Horses::Table, Horses::GenderId)
                            .to(HorseGenders::Table, HorseGenders::Id)
                            .on_delete(ForeignKeyAction::Restrict)
                            .on_update(ForeignKeyAction::Restrict),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Horses::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Horses {
    Table,
    Id,
    GivenName,
    GenderId,
    UserId,
}

#[derive(DeriveIden)]
enum HorseGenders {
    Table,
    Id,
}

#[derive(DeriveIden)]
enum Users {
    Table,
    Id,
}
