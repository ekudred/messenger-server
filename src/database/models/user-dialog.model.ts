import {
  Model,
  Table,
  Column,
  ForeignKey,
  Default,
  BelongsTo,
  Scopes,
  DataType,
  UpdatedAt,
  CreatedAt
} from 'sequelize-typescript'
import { Optional } from 'sequelize'

import Dialog from './dialog.model'
import User from './user.model'

export interface UserDialogAttributes {
  id: string
  user_id: string
  comrade_id: string
  dialog_id: string
  active: boolean
  updated_at: Date
  created_at: Date
}

export type UserDialogCreationAttributes = Optional<UserDialogAttributes, 'id' | 'updated_at' | 'created_at'>

@Scopes(() => ({
  dialog: { include: [{ model: Dialog, include: ['roster', 'messages'] }] }
}))
@Table({ tableName: 'user_dialogs' })
class UserDialog extends Model<UserDialogAttributes, UserDialogCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare user_id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare comrade_id: string

  @ForeignKey(() => Dialog)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare dialog_id: string

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare active: boolean

  @UpdatedAt
  declare updated_at: Date

  @CreatedAt
  declare created_at: Date

  // Associations

  @BelongsTo(() => User)
  declare user: User

  @BelongsTo(() => User)
  declare comrade: User

  @BelongsTo(() => Dialog)
  declare dialog: Dialog
}

export default UserDialog