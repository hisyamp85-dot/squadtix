import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddColumnsToCategoryQrcodes extends BaseSchema {
  protected tableName = 'category_qrcodes'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('nip').notNullable().defaultTo('')
      table.string('ukuran_jaket').notNullable().defaultTo('')
      table.string('instansi').notNullable().defaultTo('')
      table.string('kota').notNullable().defaultTo('')
      table.string('email').notNullable().defaultTo('')
      table.string('no_hp').notNullable().defaultTo('')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('nip')
      table.dropColumn('ukuran_jaket')
      table.dropColumn('instansi')
      table.dropColumn('kota')
      table.dropColumn('email')
      table.dropColumn('no_hp')
    })
  }
}
