import { Model, Table, Column, ForeignKey, DataType, Default, BelongsTo } from 'sequelize-typescript'

import User from './user.model'

@Table({ tableName: 'auth_tokens' })
class AuthToken extends Model<AuthToken> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare user_id: string

  @Column({ type: DataType.STRING })
  declare client_id: string

  @Column({ type: DataType.STRING(1234) })
  declare refresh_token: string

  // Associations

  @BelongsTo(() => User)
  declare user: User
}

export default AuthToken
