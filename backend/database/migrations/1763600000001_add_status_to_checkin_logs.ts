import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddStatusToCheckinLogs extends BaseSchema {
  protected tableName = 'checkin_logs'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('status').notNullable().defaultTo('Pending')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status')
    })
  }
}
