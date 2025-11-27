import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterMemberUsersDropForeignIdUsers extends BaseSchema {
  protected tableName = 'member_users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('id_user')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('id_user').references('id_user').inTable('users').onDelete('CASCADE')
    })
  }
}
