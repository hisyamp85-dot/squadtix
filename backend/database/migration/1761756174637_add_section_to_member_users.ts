import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddSectionToMemberUsers extends BaseSchema {
  protected tableName = 'member_users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('section', 255).nullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('section')
    })
  }
}
