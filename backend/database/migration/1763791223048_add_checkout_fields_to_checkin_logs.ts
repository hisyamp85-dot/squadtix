import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddCheckoutFieldsToCheckinLogs extends BaseSchema {
  protected tableName = 'checkin_logs'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      // kolom waktu checkout
      table.dateTime('checkout_at').nullable()

      // siapa yang melakukan checkout
      table.string('checkout_by', 191).nullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('checkout_at')
      table.dropColumn('checkout_by')
    })
  }
}
