import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import CategoryQrcode from 'App/Models/CategoryQrcode'

export default class CheckinLog extends BaseModel {
  public static table = 'checkin_logs'

  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'category_qrcode_id' })
  public categoryQrcodeId: number

  @column()
  public qrcode: string

  @column({ columnName: 'event_id' })
  public eventId: string | null

  @column({ columnName: 'event_category_id' })
  public eventCategoryId: string | null

  @column({ columnName: 'scanned_by' })
  public scannedBy: string | null

  @column.dateTime({ columnName: 'scanned_at' })
  public scannedAt: DateTime | null

  @column.dateTime()
  public checkoutAt: DateTime | null

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

ß

  @column()
  public checkoutBy: string | null

  @belongsTo(() => CategoryQrcode, {
    foreignKey: 'categoryQrcodeId',
  })
  public categoryQrcode: BelongsTo<typeof CategoryQrcode>
}
