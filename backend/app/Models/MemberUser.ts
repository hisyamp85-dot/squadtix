import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'

export default class MemberUser extends BaseModel {
  public static table = 'member_users'

  @column({ isPrimary: true, columnName: 'member_user_id' })
  public id: number

  @column()
  public username: string

  @column()
  public password: string

  @column()
  public status: string

  @column()
  public section: string

  @column({ columnName: 'id_user' })
  public idUser: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


}
