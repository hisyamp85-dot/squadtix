import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import GroupScan from 'App/Models/GroupScan'

export default class GroupCategory extends BaseModel {
  public static table = 'group_categories'

  @column({ isPrimary: true })
  public id: number

  // Kolom group_scans_id di DB
  @column({ columnName: 'group_scans_id' })
  public groupScansId: number

  // Kolom event_category_id di DB
  @column({ columnName: 'event_category_id' })
  public eventCategoryId: string

  // Kolom event_id di DB
  @column({ columnName: 'event_id' })
  public eventId: string

  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({
    columnName: 'updated_at',
    autoCreate: true,
    autoUpdate: true,
  })
  public updatedAt: DateTime

  @belongsTo(() => GroupScan, {
    foreignKey: 'groupScansId',
  })
  public groupScan: BelongsTo<typeof GroupScan>
}
