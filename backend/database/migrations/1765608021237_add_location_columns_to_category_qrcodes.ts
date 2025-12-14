import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddLocationColumnsToCategoryQrcodes extends BaseSchema {
  protected tableName = 'category_qrcodes'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('provinsi').nullable()
      
      table.string('jabatan').nullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('provinsi', 'jabatan')
    })
  }
}
