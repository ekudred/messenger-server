import {
  Table,
  Model,
  Column,
  ForeignKey,
  Default,
  BelongsTo,
  UpdatedAt,
  CreatedAt,
  Scopes,
  DataType
} from 'sequelize-typescript'
import { Optional } from 'sequelize'

import Group from './group.model'
import User from './user.model'

export interface GroupRosterAttributes {
  id: string
  group_id: string
  user_id: string
  updated_at: Date
  created_at: Date
}

export type GroupRosterCreationAttributes = Optional<GroupRosterAttributes, 'id' | 'updated_at' | 'created_at'>

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
  group: ({ where }: any) => {
    return {
      include: [{
        model: Group.scope([
          { method: ['roster', {}] },
          { method: ['lastMessage', {}] },
          { method: ['creator', {}] },
          { method: ['unreadMessages', {}] }
        ]),
        as: 'group',
        where
      }]
    }
  },
  user: ({ where }: any) => {
    return {
      include: [{
        model: User.scope(['safe']),
        as: 'user',
        where
      }]
    }
  }
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

  @BelongsTo(() => Group)
  declare group: Group

  @BelongsTo(() => User)
  declare user: User
}

export default GroupRoster
