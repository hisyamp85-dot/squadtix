import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateCheckinLogs extends BaseSchema {
  protected tableName = 'checkin_logs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('category_qrcode_id')
        .unsigned()
        .references('id')
        .inTable('category_qrcodes')
        .onDelete('CASCADE')
      table.string('qrcode').notNullable()
      table.uuid('event_id').nullable()
      table.uuid('event_category_id').nullable()
      table.string('scanned_by').nullable()
      table.timestamp('scanned_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
