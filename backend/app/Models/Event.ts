import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Event extends BaseModel {
  public static query: any // Add this to suppress TS error for query method

  @column({ isPrimary: true })
  public id: number

  @column()
  public eventId: string

  @column()
  public eventName: string

  @column()
  public eventCategoryId: string

  @column()
  public categoryName: string

  @column()
  public status: 'Active' | 'Inactive'

  @column()
  public id_user: number

  @column.date()
  public startDate: DateTime | null

  @column.date()
  public endDate: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
