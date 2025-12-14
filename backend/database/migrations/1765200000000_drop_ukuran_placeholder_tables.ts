import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  private tables = ['add_ukuran_jaket_columns', 'fix_ukuran_column_renames']

  public async up () {
    for (const table of this.tables) {
      await this.schema.dropTableIfExists(table)
    }
  }

  public async down () {
    for (const table of this.tables) {
      if (!(await this.schema.hasTable(table))) {
        await this.schema.createTable(table, (t) => {
          t.increments('id')
          t.timestamp('created_at', { useTz: true })
          t.timestamp('updated_at', { useTz: true })
        })
      }
    }
  }
}
