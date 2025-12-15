import BaseSchema from '@ioc:Adonis/Lucid/Schema'

/**
 * Drop legacy participant fields that are no longer used.
 */
export default class DropUnusedBarcodeColumns extends BaseSchema {
  protected tableName = 'category_qrcodes'

  public async up() {
    const columns = [
      'ukuran_jaket',
      'instansi',
      'kota',
      'email',
      'no_hp',
      'id_transaction',
      'provinsi',
      'jabatan',
      'status_kehadiran',
      'tanggal_kehadiran',
    ]

    const existing: string[] = []
    for (const column of columns) {
      // eslint-disable-next-line no-await-in-loop
      if (await this.schema.hasColumn(this.tableName, column)) {
        existing.push(column)
      }
    }

    if (existing.length) {
      await this.schema.alterTable(this.tableName, (table) => {
        table.dropColumns(...existing)
      })
    }
  }

  public async down() {
    await this.schema.alterTable(this.tableName, (table) => {
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
