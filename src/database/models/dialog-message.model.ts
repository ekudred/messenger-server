import {
  Model,
  Table,
  Column,
  ForeignKey,
  HasMany,
  BelongsTo,
  Default,
  UpdatedAt,
  CreatedAt,
  Scopes,
  DataType
} from 'sequelize-typescript'
import { Optional } from 'sequelize'

import User from './user.model'
import Dialog from './dialog.model'
import DialogMessageUnread from './dialog-message-unread.model'

export interface DialogMessageAttributes {
  id: string
  author_id: string
  dialog_id: string
  text: string
  updated_at: Date
  created_at: Date
}

export type DialogMessageCreationAttributes = Optional<DialogMessageAttributes, 'id' | 'updated_at' | 'created_at'>

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
  author: ({}: any) => {
    return {
      include: [{
        model: User.scope(['safe']),
        as: 'author'
      }]
    }
  },
  unread: ({}: any) => {
    return {
      include: [{
        model: DialogMessageUnread.scope([{ method: ['rosterItem', {}] }]),
        as: 'unread'
      }]
    }
  }
}))
@Table({ tableName: 'dialog_messages' })
class DialogMessage extends Model<DialogMessageAttributes, DialogMessageCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare author_id: string

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

  @BelongsTo(() => User)
  declare author: User

  @HasMany(() => DialogMessageUnread)
  declare unread: DialogMessageUnread[]

  @BelongsTo(() => Dialog)
  declare dialog: Dialog
}

export default DialogMessage
