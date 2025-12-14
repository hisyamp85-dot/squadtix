import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddAttendanceColumnsToCategoryQrcodes extends BaseSchema {
  protected tableName = 'category_qrcodes'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('status_kehadiran').nullable()
      table.date('tanggal_kehadiran').nullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('status_kehadiran', 'tanggal_kehadiran')
    })
  }
}
