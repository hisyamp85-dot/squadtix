import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateGroupScans extends BaseSchema {
  protected tableName = 'group_scans'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name_group').notNullable()
      table.uuid('event_id').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
