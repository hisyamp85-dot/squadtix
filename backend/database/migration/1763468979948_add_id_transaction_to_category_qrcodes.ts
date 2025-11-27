import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddIdTransactionToCategoryQrcodes extends BaseSchema {
  protected tableName = 'category_qrcodes'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('id_transaction').nullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('id_transaction')
    })
  }
}
