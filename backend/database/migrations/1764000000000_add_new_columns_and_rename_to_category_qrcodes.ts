import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddNewColumnsAndRenameToCategoryQrcodes extends BaseSchema {
  protected tableName = 'category_qrcodes'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('ukuran_jaket', 'ukuran_baju')
      table.string('provinsi').nullable()
      table.string('jabatan').nullable()
      table.string('status_kehadiran').nullable()
      table.dateTime('tanggal_kehadiran').nullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('provinsi')
      table.dropColumn('jabatan')
      table.dropColumn('status_kehadiran')
      table.dropColumn('tanggal_kehadiran')
      table.renameColumn('ukuran_baju', 'ukuran_jaket')
    })
  }
}
