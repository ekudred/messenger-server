import {
  Model,
  Table,
  Column,
  ForeignKey,
  HasMany,
  BelongsTo,
  Default,
  Scopes,
  DefaultScope,
  UpdatedAt,
  CreatedAt,
  DataType,
} from 'sequelize-typescript'
import { Optional } from 'sequelize'

import User from './user.model'
import Dialog from './dialog.model'
import { userSafeAttributes } from '../constants'
import DialogMessageUnread from './dialog-message-unread.model'

export interface DialogMessageAttributes {
  id: string
  user_id: string
  dialog_id: string
  text: string
  updated_at: Date
  created_at: Date
}

export type DialogMessageCreationAttributes = Optional<DialogMessageAttributes, 'id' | 'updated_at' | 'created_at'>

@DefaultScope(() => ({
  include: [
    { model: User, attributes: userSafeAttributes },
    { model: DialogMessageUnread }
  ]
}))
@Scopes(() => ({
  dialog: { include: [{ model: Dialog }] },
  unread: { include: [{ model: DialogMessageUnread }] },
  user: { include: [{ model: User, attributes: userSafeAttributes }] }
}))
@Table({ tableName: 'dialog_messages' })
class DialogMessage extends Model<DialogMessageAttributes, DialogMessageCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare user_id: string

  @ForeignKey(() => Dialog)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare dialog_id: string

  @Column({ type: DataType.STRING(1024) })
  declare text: string

  @UpdatedAt
  declare updated_at: Date

  @CreatedAt
  declare created_at: Date

  // Associations

  @HasMany(() => DialogMessageUnread)
  declare unread: DialogMessageUnread[]

  @BelongsTo(() => User)
  declare user: User

  @BelongsTo(() => Dialog)
  declare dialog: Dialog
}

export default DialogMessage
