import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'category_qrcodes'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('ukuran_jaket')
      table.dropColumn('instansi')
      table.dropColumn('kota')
      table.dropColumn('email')
      table.dropColumn('no_hp')
      table.dropColumn('id_transaction')
      table.dropColumn('provinsi')
      table.dropColumn('jabatan')
      table.dropColumn('status_kehadiran')
      table.dropColumn('tanggal_kehadiran')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('ukuran_jaket').nullable()
      table.string('instansi').nullable()
      table.string('kota').nullable()
      table.string('email').nullable()
      table.string('no_hp').nullable()
      table.string('id_transaction').nullable()
      table.string('provinsi').nullable()
      table.string('jabatan').nullable()
      table.string('status_kehadiran').nullable()
      table.timestamp('tanggal_kehadiran').nullable()
    })
  }
}