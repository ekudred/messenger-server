import {
  Model,
  Table,
  Column,
  ForeignKey,
  Default,
  BelongsTo,
  Scopes,
  DefaultScope,
  DataType, UpdatedAt, CreatedAt
} from 'sequelize-typescript'
import { Op, Optional } from 'sequelize'

import Group from './group.model'
import User from './user.model'
import { userSafeAttributes } from '../constants'

export interface GroupRosterAttributes {
  id: string
  group_id: string
  user_id: string
  updated_at: Date
  created_at: Date
}

export type GroupRosterCreationAttributes = Optional<GroupRosterAttributes, 'id' | 'updated_at' | 'created_at'>

@DefaultScope(() => ({
  include: [{ model: User, attributes: userSafeAttributes }]
}))
@Scopes(() => ({
  searchLikeName: value => {
    return {
      include: [
        {
          model: Group,
          include: ['roster', 'messages', 'creator'],
          where: {
            name: { [Op.like]: `%${value}%` }
          }
        }
      ]
    }
  },
  group: { include: [{ model: Group, include: ['roster', 'messages', 'creator'] }] },
  user: { include: [{ model: User, attributes: userSafeAttributes }] }
}))
@Table({ tableName: 'group_roster' })
class GroupRoster extends Model<GroupRosterAttributes, GroupRosterCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => Group)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare group_id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare user_id: string

  @UpdatedAt
  declare updated_at: Date

  @CreatedAt
  declare created_at: Date

  // Associations

  @BelongsTo(() => User)
  declare user: User

  @BelongsTo(() => Group)
  declare group: Group
}

export default GroupRoster
