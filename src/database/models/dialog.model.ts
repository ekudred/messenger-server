import {
  Model,
  Table,
  Column,
  Default,
  HasOne,
  HasMany,
  CreatedAt,
  UpdatedAt,
  Scopes,
  DataType
} from 'sequelize-typescript'
import { Optional } from 'sequelize'

import FolderDialogRoster from './folder-dialog-roster.model'
import DialogMessage from './dialog-message.model'
import DialogLastMessage from './dialog-last-message.model'
import DialogMessageUnread from './dialog-message-unread.model'
import DialogRoster from './dialog-roster.model'

export interface DialogAttributes {
  id: string
  updated_at: Date
  created_at: Date
}

export type DialogCreationAttributes = Optional<DialogAttributes, 'id' | 'updated_at' | 'created_at'>

@Scopes(() => ({
  roster: ({}: any) => {
    return {
      include: [{
        model: DialogRoster.scope([{ method: ['user', {}] }]),
        as: 'roster'
      }]
    }
  },
  messages: ({ whereMessages }: any) => {
    return {
      // order: [['messages', 'created_at', 'ASC']],
      include: [{
        model: DialogMessage.scope([{ method: ['author', {}] }, { method: ['unread', {}] }]),
        as: 'messages',
        // order: [[{ model: DialogMessage, as: 'messages' }, 'created_at', 'ASC']],
        // limit: 1,
        where: whereMessages
      }]
    }
  },
  orderMessages: {
    order: [[{ model: DialogMessage, as: 'messages' }, 'created_at', 'DESC']]
  },
  lastMessage: ({}: any) => {
    return {
      include: [{
        model: DialogLastMessage.scope([{ method: ['message', {}] }]), as: 'last_message'
      }]
    }
  },
  unreadMessages: ({}: any) => {
    return {
      include: [{
        model: DialogMessageUnread.scope([{ method: ['message', {}] }]), as: 'unread_messages'
      }]
    }
  }
}))
@Table({ tableName: 'dialogs' })
class Dialog extends Model<DialogAttributes, DialogCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @UpdatedAt
  declare updated_at: Date

  @CreatedAt
  declare created_at: Date

  // Associations

  @HasMany(() => DialogRoster)
  declare roster: DialogRoster[]

  @HasMany(() => DialogMessage)
  declare messages: DialogMessage[]

  @HasOne(() => DialogLastMessage)
  declare last_message: DialogLastMessage

  @HasMany(() => DialogMessageUnread)
  declare unread_messages: DialogMessageUnread[]

  @HasMany(() => FolderDialogRoster)
  declare folder_roster: FolderDialogRoster[]
}

export default Dialog
