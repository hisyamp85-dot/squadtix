import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class GroupScan extends BaseModel {
  public static query: any // Add this to suppress TS error for query method
  public static table = 'group_scans'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name_group: string

  @column()
  public event_id: string

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
