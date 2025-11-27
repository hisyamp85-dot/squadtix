import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterMemberUsersIdToAutoIncrements extends BaseSchema {
  protected tableName = 'member_users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      // Change member_user_id to auto increment integer
      // Drop primary key constraint first
      table.dropPrimary()
      // Add new auto increment column
      table.increments('new_member_user_id')
      // Drop old column
      table.dropColumn('member_user_id')
      // Rename new column to member_user_id and make it primary
      table.renameColumn('new_member_user_id', 'member_user_id')
      // Set as primary key
      table.primary(['member_user_id'])
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      // Revert back to string
      table.dropPrimary()
      table.dropColumn('member_user_id')
      table.string('member_user_id', 20).primary()
    })
  }
}
