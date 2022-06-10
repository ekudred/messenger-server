import {
  Table,
  Model,
  Column,
  ForeignKey,
  Default,
  BelongsTo,
  UpdatedAt,
  CreatedAt,
  DataType
} from 'sequelize-typescript'
import { Optional } from 'sequelize'

import User from './user.model'

export interface AuthTokenAttributes {
  id: string
  user_id: string
  client_id: string
  refresh_token: string
  updated_at: Date
  created_at: Date
}

export type AuthTokenCreationAttributes = Optional<AuthTokenAttributes, 'id' | 'updated_at' | 'created_at'>

@Table({ tableName: 'auth_tokens' })
class AuthToken extends Model<AuthTokenAttributes, AuthTokenCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare user_id: string

  @Column({ type: DataType.STRING })
  declare client_id: string

  @Column({ type: DataType.STRING(1024) })
  declare refresh_token: string

  @UpdatedAt
  declare updated_at: Date

  @CreatedAt
  declare created_at: Date

  // Associations

  @BelongsTo(() => User)
  declare user: User
}

export default AuthToken
