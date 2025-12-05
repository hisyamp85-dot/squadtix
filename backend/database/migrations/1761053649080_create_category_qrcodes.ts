import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateCategoryQrcodes extends BaseSchema {
  protected tableName = 'category_qrcodes'

  public async up () {
this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('table_events_id').unsigned().references('id').inTable('events').onDelete('CASCADE')
      table.string('qrcode').notNullable()
      table.uuid('event_id').notNullable()
      table.uuid('event_category_id').notNullable()
      table.string('name').notNullable()

      // Added new columns
      table.string('nip').notNullable() // Type mixed of letters and numbers
      table.string('ukuran_jaket').notNullable() // Type letters only
      table.string('instansi').notNullable() // Type letters only
      table.string('kota').notNullable() // Type letters only
      table.string('email').notNullable() // Type letters and numbers
      table.string('no_hp').notNullable() // Type numbers only

      table.text('other_data').nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
