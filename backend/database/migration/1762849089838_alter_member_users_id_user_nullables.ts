import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterMemberUsersIdUserNullables extends BaseSchema {
  protected tableName = 'member_users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('id_user').alter().nullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('id_user').alter().notNullable()
    })
  }
}
