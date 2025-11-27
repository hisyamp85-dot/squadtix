import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DropProjectFromUsers extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('project')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('project', 255).nullable()
    })
  }
}
