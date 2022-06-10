import {
  Table,
  Model,
  Column,
  ForeignKey,
  BelongsTo,
  Default,
  UpdatedAt,
  CreatedAt,
  Scopes,
  DataType
} from 'sequelize-typescript'
import { Optional } from 'sequelize'

import Dialog from './dialog.model'
import DialogMessage from './dialog-message.model'

export interface DialogLastMessageAttributes {
  id: string
  dialog_id: string
  message_id: string
  updated_at: Date
  created_at: Date
}

export type DialogLastMessageCreationAttributes = Optional<DialogLastMessageAttributes, 'id' | 'updated_at' | 'created_at'>

@Scopes(() => ({
  dialogChat: ({ whereMessages }: any) => {
    return {
      include: [{
        model: Dialog.scope([
          { method: ['roster', {}] },
          { method: ['messages', { whereMessages }] }
        ]),
        as: 'dialog'
      }]
    }
  },
  dialog: ({}: any) => {
    return {
      include: [{
        model: Dialog.scope([
          { method: ['roster', {}] },
          { method: ['lastMessage', {}] },
          { method: ['unreadMessages', {}] }
        ]),
        as: 'dialog'
      }]
    }
  },
  message: ({}: any) => {
    return {
      include: [{
        model: DialogMessage.scope([
          { method: ['author', {}] },
          { method: ['unread', {}] }
        ]),
        as: 'message'
      }]
    }
  }
}))
@Table({ tableName: 'dialog_last_messages' })
class DialogLastMessage extends Model<DialogLastMessageAttributes, DialogLastMessageCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => Dialog)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare dialog_id: string

  @ForeignKey(() => DialogMessage)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare message_id: DialogMessage

  @UpdatedAt
  declare updated_at: Date

  @CreatedAt
  declare created_at: Date

  // Associations

  @BelongsTo(() => DialogMessage)
  declare message: DialogMessage

  @BelongsTo(() => Dialog)
  declare dialog: Dialog
}

export default DialogLastMessage