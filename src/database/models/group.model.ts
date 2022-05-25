import {
  Model,
  Table,
  Column,
  ForeignKey,
  HasMany,
  Default,
  BelongsTo,
  Scopes,
  DataType,
  UpdatedAt, CreatedAt
} from 'sequelize-typescript'
import { Optional } from 'sequelize'

import User from './user.model'
import GroupRoster from './group-roster.model'
import GroupMessage from './group-message.model'
import FolderGroupRoster from './folder-group-roster.model'

import { defaultGroupChatAvatarImage } from '../../utils/constants'
import { userSafeAttributes } from '../constants'

export interface GroupAttributes {
  id: string
  creator_id: string
  name: string
  avatar: string
  updated_messages_at: Date
  updated_at: Date
  created_at: Date
}

export type GroupCreationAttributes = Optional<GroupAttributes, 'id' | 'updated_at' | 'created_at'>

@Scopes(() => ({
  roster: { include: [{ model: GroupRoster }] },
  messages: { include: [{ model: GroupMessage, include: ['unread'] }] },
  creator: { include: [{ model: User, attributes: userSafeAttributes }] }
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

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE })
  declare updated_messages_at: Date

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

  @HasMany(() => FolderGroupRoster)
  declare folder_roster: FolderGroupRoster[]
}

export default Group
