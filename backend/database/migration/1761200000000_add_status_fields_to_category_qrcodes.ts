import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddStatusFieldsToCategoryQrcodes extends BaseSchema {
  protected tableName = 'category_qrcodes'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('status').notNullable().defaultTo('Pending')
      table.timestamp('redeemed_at', { useTz: true }).nullable()
      table.string('redeemed_by').nullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status')
      table.dropColumn('redeemed_at')
      table.dropColumn('redeemed_by')
    })
  }
}
