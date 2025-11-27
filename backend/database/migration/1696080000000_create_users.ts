import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_user').primary()
      table.string('name', 255).notNullable()
      table.string('username', 255).notNullable().unique()
      table.string('email', 255).notNullable().unique()
      table.string('password', 255).notNullable()
      table.string('role', 100).notNullable()

      table.string('project', 255).nullable()

      table.string('status', 50).notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
