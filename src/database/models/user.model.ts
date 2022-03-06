import { Model, Table, Column, Unique, IsUUID, PrimaryKey, IsEmail, Is, Default, AllowNull } from 'sequelize-typescript'

import { RegExpUserName, RegExpFullName, RegExpDate, RegExpPhoneNumber, AuthRoles } from '../../utils/constants'

@Table({ tableName: 'users' })
class User extends Model<User> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  declare id: string

  @Column
  declare password: string

  @IsEmail
  @Unique
  @Column
  declare email: string

  @Is(RegExpUserName)
  @Unique
  @Column
  declare username: string

  @Is(RegExpFullName)
  @AllowNull
  @Column
  declare fullname: string

  @Is(RegExpDate)
  @AllowNull
  @Column
  declare birthdate: string

  @Is(RegExpPhoneNumber)
  @AllowNull
  @Column
  declare phone: string

  @AllowNull
  @Column
  declare avatar: string

  @Default(AuthRoles.USER)
  @Column
  declare role: string

  @Column
  declare activation_link: string

  @Default(false)
  @Column
  declare is_activated: boolean
}

export default User

// import { DataTypes, Model } from '@sequelize/core'

// import sequelize from '../sequelize'

// import { AuthRoles } from '../../utils/constants'

// interface UserAttributes {
//   id: string
//   password: string
//   email: string
//   username: string
//   fullname: string
//   birthdate: string
//   phone: string
//   avatar: string
//   role: string
//   is_activated: boolean
//   activation_link: string
// }

// class User extends Model<UserAttributes> {
//   declare id: string
//   declare password: string
//   declare email: string
//   declare username: string
//   declare fullname: string
//   declare birthdate: string
//   declare phone: string
//   declare avatar: string
//   declare role: string
//   declare is_activated: boolean
//   declare activation_link: string
// }

// User.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       primaryKey: true,
//     },
//     password: {
//       type: DataTypes.STRING,
//     },
//     email: {
//       type: DataTypes.STRING,
//       unique: true,
//     },
//     username: {
//       type: DataTypes.STRING,
//       unique: true,
//     },
//     fullname: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     birthdate: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     phone: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     avatar: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     role: {
//       type: DataTypes.STRING,
//       defaultValue: AuthRoles.USER,
//     },
//     is_activated: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },
//     activation_link: {
//       type: DataTypes.STRING,
//     },
//   },
//   {
//     tableName: 'users',
//     sequelize,
//   }
// )

// export default User
