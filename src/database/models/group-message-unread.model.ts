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

import GroupMessage from './group-message.model'
import GroupRoster from './group-roster.model'

export interface GroupMessageUnreadAttributes {
  id: string
  message_id: string
  roster_item_id: string
  updated_at: Date
  created_at: Date
}

export type GroupMessageUnreadCreationAttributes = Optional<GroupMessageUnreadAttributes, 'id' | 'updated_at' | 'created_at'>

@DefaultScope(() => ({
  include: [{ model: GroupRoster, include: ['user'] }]
}))
@Table({ tableName: 'group_message_unread' })
class GroupMessageUnread extends Model<GroupMessageUnreadAttributes, GroupMessageUnreadCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => GroupMessage)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare message_id: string

  @ForeignKey(() => GroupRoster)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare roster_item_id: string

  @UpdatedAt
  declare updated_at: Date

  @CreatedAt
  declare created_at: Date

  // Associations

  @BelongsTo(() => GroupMessage)
  declare message: GroupMessage

  @BelongsTo(() => GroupRoster)
  declare roster_item: GroupRoster
}

export default GroupMessageUnread