import {
  Table,
  Model,
  Column,
  Default,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  DefaultScope,
  DataType,
} from 'sequelize-typescript'
import { Optional } from 'sequelize'

import DialogMessage from './dialog-message.model'
import DialogRoster from './dialog-roster.model'

export interface DialogMessageUnreadAttributes {
  id: string
  message_id: string
  roster_item_id: string
  updated_at: Date
  created_at: Date
}

export type DialogMessageUnreadCreationAttributes = Optional<DialogMessageUnreadAttributes, 'id' | 'updated_at' | 'created_at'>

@DefaultScope(() => ({
  include: [{ model: DialogRoster, include: ['user'] }]
}))
@Table({ tableName: 'dialog_message_unread' })
class DialogMessageUnread extends Model<DialogMessageUnreadAttributes, DialogMessageUnreadCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => DialogMessage)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare message_id: string

  @ForeignKey(() => DialogRoster)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare roster_item_id: string

  @UpdatedAt
  declare updated_at: Date

  @CreatedAt
  declare created_at: Date

  // Associations

  @BelongsTo(() => DialogMessage)
  declare message: DialogMessage

  @BelongsTo(() => DialogRoster)
  declare roster_item: DialogRoster
}

export default DialogMessageUnread