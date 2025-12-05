import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddIdUserToEvents extends BaseSchema {
  protected tableName = 'events'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('id_user').references('id_user').inTable('users').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('id_user')
      table.dropColumn('id_user')
    })
  }
}
