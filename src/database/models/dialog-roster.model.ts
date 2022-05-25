import {
  Model,
  Table,
  Column,
  ForeignKey,
  Default,
  BelongsTo,
  Scopes,
  DefaultScope,
  UpdatedAt,
  CreatedAt,
  DataType
} from 'sequelize-typescript'
import { Optional } from 'sequelize'

import Dialog from './dialog.model'
import User from './user.model'
import { userSafeAttributes } from '../constants'

export interface DialogRosterAttributes {
  id: string
  dialog_id: string
  user_id: string
  updated_at: Date
  created_at: Date
}

export type DialogRosterCreationAttributes = Optional<DialogRosterAttributes, 'id' | 'updated_at' | 'created_at'>

@DefaultScope(() => ({
  include: [{ model: User, attributes: userSafeAttributes }]
}))
@Scopes(() => ({
  dialog: { include: [{ model: Dialog, include: ['roster', 'messages'] }] },
  user: { include: [{ model: User, attributes: userSafeAttributes }] }
}))
@Table({ tableName: 'dialog_roster' })
class DialogRoster extends Model<DialogRosterAttributes, DialogRosterCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => Dialog)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare dialog_id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare user_id: string

  @UpdatedAt
  declare updated_at: Date

  @CreatedAt
  declare created_at: Date

  // Associations

  @BelongsTo(() => User)
  declare user: User

  @BelongsTo(() => Dialog)
  declare dialog: Dialog
}

export default DialogRoster
