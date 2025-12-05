import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddStatusToGroupScans extends BaseSchema {
  protected tableName = 'group_scans'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('status').defaultTo('active')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status')
    })
  }
}
