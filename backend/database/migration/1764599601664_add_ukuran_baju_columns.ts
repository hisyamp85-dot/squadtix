import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddUkuranBajuColumns extends BaseSchema {
  protected tableName = 'category_qrcodes'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('ukuran_baju').notNullable().defaultTo('')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('ukuran_baju')
    })
  }
}
