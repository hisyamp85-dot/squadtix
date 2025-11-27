import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddUniqueConstraintToQrcodes extends BaseSchema {
  protected tableName = 'category_qrcodes'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.unique(['qrcode', 'event_category_id'], 'unique_qrcode_per_category')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['qrcode', 'event_category_id'], 'unique_qrcode_per_category')
    })
  }
}
