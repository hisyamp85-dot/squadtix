import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class CategoryQrcode extends BaseModel {
   public static table = 'category_qrcodes'

  @column({ isPrimary: true })
  public id: number

  @column()
  public table_events_id: number

  @column()
  public qrcode: string

  @column()
  public event_id: string

  @column()
  public event_category_id: string

  @column()
  public name: string

  @column()
  public other_data: string | null

  @column()
  public id_transaction: string | null

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
