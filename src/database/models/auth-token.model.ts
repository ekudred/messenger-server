import { Model, Table, Column, IsUUID, PrimaryKey, ForeignKey, DataType } from 'sequelize-typescript'

import User from './user.model'

@Table({ tableName: 'auth_tokens' })
class AuthToken extends Model<AuthToken> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  declare id: string

  @ForeignKey(() => User)
  @Column
  declare user_id: string

  @Column
  declare client_id: string

  @Column(DataType.STRING(1234))
  declare refresh_token: string
}

export default AuthToken

// import { DataTypes, Model } from '@sequelize/core'

// import sequelize from '../sequelize'

// interface AuthTokenAttributes {
//   id: string
//   user_id: string
//   client_id: string
//   refresh_token: string
// }

// class AuthToken extends Model<AuthTokenAttributes> {
//   declare id: string
//   declare user_id: string
//   declare client_id: string
//   declare refresh_token: string
// }

// AuthToken.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       primaryKey: true,
//     },
//     user_id: {
//       type: DataTypes.UUID,
//     },
//     client_id: {
//       type: DataTypes.STRING,
//     },
//     refresh_token: {
//       type: DataTypes.STRING(1234),
//     },
//   },
//   {
//     tableName: 'auth_tokens',
//     sequelize,
//   }
// )

// export default AuthToken
