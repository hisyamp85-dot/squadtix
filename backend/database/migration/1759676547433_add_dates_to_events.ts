import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddDatesToEvents extends BaseSchema {
  protected tableName = 'events'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.date('start_date')
      table.date('end_date')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('start_date')
      table.dropColumn('end_date')
    })
  }
}
