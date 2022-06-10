import {
  Table,
  Model,
  Column,
  ForeignKey,
  HasOne,
  HasMany,
  Default,
  BelongsTo,
  UpdatedAt,
  CreatedAt,
  Scopes,
  DataType
} from 'sequelize-typescript'
import { Optional } from 'sequelize'

import User from './user.model'
import GroupRoster from './group-roster.model'
import GroupMessage from './group-message.model'
import GroupLastMessage from './group-last-message.model'
import FolderGroupRoster from './folder-group-roster.model'
import GroupMessageUnread from './group-message-unread.model'
import { defaultGroupChatAvatarImage } from '../../utils/constants'

export interface GroupAttributes {
  id: string
  creator_id: string
  name: string
  avatar: string
  updated_at: Date
  created_at: Date
}

export type GroupCreationAttributes = Optional<GroupAttributes, 'id' | 'updated_at' | 'created_at'>

@Scopes(() => ({
  roster: ({}: any) => {
    return {
      include: [{
        model: GroupRoster.scope([{ method: ['user', {}] }]),
        as: 'roster'
      }]
    }
  },
  messages: ({ whereMessages }: any) => {
    return {
      include: [{
        model: GroupMessage.scope([
          { method: ['author', {}] },
          { method: ['unread', {}] }
        ]),
        as: 'messages',
        where: whereMessages
      }]
    }
  },
  lastMessage: ({}: any) => {
    return {
      include: [{
        model: GroupLastMessage.scope([{ method: ['message', {}] }]),
        as: 'last_message'
      }]
    }
  },
  creator: ({}: any) => {
    return {
      include: [{
        model: User.scope(['safe']),
        as: 'creator'
      }]
    }
  },
  unreadMessages: ({}: any) => {
    return {
      include: [{
        model: GroupMessageUnread.scope([{ method: ['message', {}] }]), as: 'unread_messages'
      }]
    }
  }
}))
@Table({ tableName: 'groups' })
class Group extends Model<GroupAttributes, GroupCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare creator_id: string

  @Column({ type: DataType.STRING })
  declare name: string

  @Default(defaultGroupChatAvatarImage)
  @Column({ type: DataType.STRING })
  declare avatar: string

  @UpdatedAt
  declare updated_at: Date

  @CreatedAt
  declare created_at: Date

  // Associations

  @BelongsTo(() => User)
  declare creator: User

  @HasMany(() => GroupRoster)
  declare roster: GroupRoster[]

  @HasMany(() => GroupMessage)
  declare messages: GroupMessage[]

  @HasOne(() => GroupLastMessage)
  declare last_message: GroupLastMessage

  @HasMany(() => GroupMessageUnread)
  declare unread_messages: GroupMessageUnread[]

  @HasMany(() => FolderGroupRoster)
  declare folder_roster: FolderGroupRoster[]
}

export default Group
