import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateGroupCategories extends BaseSchema {
  protected tableName = 'group_categories'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('group_scans_id').unsigned().references('id').inTable('group_scans').onDelete('CASCADE')
      table.uuid('event_category_id').notNullable()
      table.uuid('event_id').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
