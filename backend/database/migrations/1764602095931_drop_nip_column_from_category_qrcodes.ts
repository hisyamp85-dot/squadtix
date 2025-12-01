import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DropNipColumnFromCategoryQrcodes extends BaseSchema {
  protected tableName = 'category_qrcodes'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('nip')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('nip').notNullable().defaultTo('')
    })
  }
}
