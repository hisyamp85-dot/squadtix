import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterTanggalKehadiranToDate extends BaseSchema {
  protected tableName = 'category_qrcodes'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.date('tanggal_kehadiran').nullable().alter()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dateTime('tanggal_kehadiran').nullable().alter()
    })
  }
}
