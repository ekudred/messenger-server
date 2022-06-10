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

import Group from './group.model'
import GroupMessage from './group-message.model'

export interface GroupLastMessageAttributes {
  id: string
  dialog_id: string
  message_id: string
  updated_at: Date
  created_at: Date
}

export type GroupLastMessageCreationAttributes = Optional<GroupLastMessageAttributes, 'id' | 'updated_at' | 'created_at'>

@Scopes(() => ({
  groupChat: ({ whereMessages }: any) => {
    return {
      include: [{
        model: Group.scope([
          { method: ['roster', {}] },
          { method: ['messages', { whereMessages }] },
          { method: ['creator', {}] }
        ]),
        as: 'group'
      }]
    }
  },
  group: ({}: any) => {
    return {
      include: [{
        model: Group.scope([
          { method: ['roster', {}] },
          { method: ['lastMessage', {}] },
          { method: ['creator', {}] },
          { method: ['unreadMessages', {}] }
        ]),
        as: 'group'
      }]
    }
  },
  message: ({}: any) => {
    return {
      include: [{
        model: GroupMessage.scope([{ method: ['author', {}] }, { method: ['unread', {}] }]),
        as: 'message'
      }]
    }
  }
}))
@Table({ tableName: 'group_last_messages' })
class GroupLastMessage extends Model<GroupLastMessageAttributes, GroupLastMessageCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => Group)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare group_id: string

  @ForeignKey(() => GroupMessage)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare message_id: GroupMessage

  @UpdatedAt
  declare updated_at: Date

  @CreatedAt
  declare created_at: Date

  // Associations

  @BelongsTo(() => GroupMessage)
  declare message: GroupMessage

  @BelongsTo(() => Group)
  declare group: Group
}

export default GroupLastMessage