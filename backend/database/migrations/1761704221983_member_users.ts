import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MemberUsers extends BaseSchema {
  protected tableName = 'member_users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('member_user_id', 20).primary()
      table.string('username', 255).notNullable().unique()
      table.string('password', 255).notNullable()
      table.string('status', 50).notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
