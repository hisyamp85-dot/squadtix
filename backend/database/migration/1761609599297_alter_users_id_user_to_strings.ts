import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterUsersIdUserToStrings extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    // Since the table is already created with string id_user, no need to alter
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      // Drop primary key
      table.dropPrimary()
      // Change back to increments
      table.increments('id_user').primary().alter()
    })
  }
}
