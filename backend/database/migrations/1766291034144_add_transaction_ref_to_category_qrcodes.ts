import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddTransactionRefToCategoryQrcodes extends BaseSchema {
  protected tableName = 'category_qrcodes'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('id_transaction', 255).nullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('id_transaction')
    })
  }
}
