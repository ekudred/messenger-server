import {
  Table,
  Model,
  Column,
  ForeignKey,
  BelongsTo,
  Default,
  UpdatedAt,
  CreatedAt,
  HasMany,
  Scopes,
  DataType
} from 'sequelize-typescript'
import { Optional } from 'sequelize'

import User from './user.model'
import Group from './group.model'
import GroupMessageUnread from './group-message-unread.model'

export interface GroupMessageAttributes {
  id: string
  author_id: string
  group_id: string
  text: string
  updated_at: Date
  created_at: Date
}

export type GroupMessageCreationAttributes = Optional<GroupMessageAttributes, 'id' | 'updated_at' | 'created_at'>

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
  unread: ({}: any) => {
    return {
      include: [{
        model: GroupMessageUnread.scope([{ method: ['rosterItem', {}] }]),
        as: 'unread'
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
  }
}))
@Table({ tableName: 'group_messages' })
class GroupMessage extends Model<GroupMessageAttributes, GroupMessageCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare author_id: string

  @ForeignKey(() => Group)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare group_id: string

  @Column({ type: DataType.STRING(1024) })
  declare text: string

  @UpdatedAt
  declare updated_at: Date

  @CreatedAt
  declare created_at: Date

  // Associations

  @BelongsTo(() => User)
  declare author: User

  @HasMany(() => GroupMessageUnread)
  declare unread: GroupMessageUnread[]

  @BelongsTo(() => Group)
  declare group: Group
}

export default GroupMessage
