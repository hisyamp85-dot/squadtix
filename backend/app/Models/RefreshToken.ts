import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class RefreshToken extends BaseModel {
  public static table = 'refresh_tokens'

  @column({ isPrimary: true })
  public id: number

  // FK → users.id_user
  @column({ columnName: 'user_id' })
  public userId: number

  @column()
  public token: string

  @column({ columnName: 'is_revoked' })
  public isRevoked: boolean

  @column.dateTime({ columnName: 'expires_at' })
  public expiresAt: DateTime

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    columnName: 'updated_at',
  })
  public updatedAt: DateTime

  // ✅ INI KUNCI PERBAIKANNYA
  @belongsTo(() => User, {
    foreignKey: 'userId',
    localKey: 'id_user',
  })
  public user: BelongsTo<typeof User>
}
