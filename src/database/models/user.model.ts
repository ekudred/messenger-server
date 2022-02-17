import { Model, Table, Column, Unique, IsUUID, PrimaryKey, IsEmail, Is, Default, AllowNull } from 'sequelize-typescript'

import { RegExpUserName, RegExpFullName, RegExpDate, RegExpPhoneNumber, Roles } from '../../utils/constants'

@Table({ tableName: 'users' })
class User extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  public id!: string

  @Column
  public password!: string

  @IsEmail
  @Unique
  @Column
  public email!: string

  @Is(RegExpUserName)
  @Unique
  @Column
  public username!: string

  @Is(RegExpFullName)
  @AllowNull
  @Column
  public fullname!: string

  @Is(RegExpDate)
  @AllowNull
  @Column
  public birthdate!: string

  @Is(RegExpPhoneNumber)
  @AllowNull
  @Column
  public phone!: string

  @AllowNull
  @Column
  public avatar!: string

  @Default(Roles.USER)
  @Column
  public role!: string

  @Column
  public activation_link!: string

  @Default(false)
  @Column
  public is_activated!: boolean
}

export default User
