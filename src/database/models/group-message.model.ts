import {
  Model,
  Table,
  Column,
  ForeignKey,
  BelongsTo,
  Default,
  DefaultScope,
  UpdatedAt,
  CreatedAt,
  Scopes,
  DataType, HasMany
} from 'sequelize-typescript'
import { Optional } from 'sequelize'

import User from './user.model'
import Group from './group.model'
import GroupMessageUnread from './group-message-unread.model'
import { userSafeAttributes } from '../constants'

export interface GroupMessageAttributes {
  id: string
  user_id: string
  group_id: string
  text: string
  updated_at: Date
  created_at: Date
}

export type GroupMessageCreationAttributes = Optional<GroupMessageAttributes, 'id' | 'updated_at' | 'created_at'>

@DefaultScope(() => ({
  include: [
    { model: User, attributes: userSafeAttributes },
    { model: GroupMessageUnread }
  ]
}))
@Scopes(() => ({
  group: { include: [{ model: Group, include: ['roster', 'messages', 'creator'] }] },
  unread: { include: [{ model: GroupMessageUnread }] },
  user: { include: [{ model: User, attributes: userSafeAttributes }] }
}))
@Table({ tableName: 'group_messages' })
class GroupMessage extends Model<GroupMessageAttributes, GroupMessageCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare user_id: string

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

  @HasMany(() => GroupMessageUnread)
  declare unread: GroupMessageUnread[]

  @BelongsTo(() => User)
  declare user: User

  @BelongsTo(() => Group)
  declare group: Group
}

export default GroupMessage
