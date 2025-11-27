import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateEvents extends BaseSchema {
  protected tableName = 'events'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('event_id').notNullable()
      table.string('event_name').notNullable()
      table.uuid('event_category_id').notNullable()
      table.string('category_name').notNullable()
      table.enum('status', ['Active', 'Inactive']).notNullable()

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
