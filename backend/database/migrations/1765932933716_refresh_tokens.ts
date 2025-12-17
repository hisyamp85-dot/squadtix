import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RefreshTokens extends BaseSchema {
  protected tableName = 'refresh_tokens'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // ✅ SAMA DENGAN users.id_user (INTEGER PK)
      table
        .integer('user_id')
        .notNullable()
        .references('id_user')
        .inTable('users')
        .onDelete('CASCADE')

      table.string('token', 255).notNullable().unique()
      table.boolean('is_revoked').defaultTo(false)
      table.timestamp('expires_at', { useTz: true }).notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
