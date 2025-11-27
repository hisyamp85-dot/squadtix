import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import GroupScan from 'App/Models/GroupScan'

export default class GroupCategory extends BaseModel {
  public static query: any // Add this to suppress TS error for query method
  public static table = 'group_categories'

  @column({ isPrimary: true })
  public id: number

  @column()
  public group_scans_id: number

  @column()
  public event_category_id: string

  @column()
  public event_id: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @belongsTo(() => GroupScan, {
    foreignKey: 'group_scans_id',
  })
  public groupScan: BelongsTo<typeof GroupScan>
}
