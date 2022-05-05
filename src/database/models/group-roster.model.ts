import {
  Model,
  Table,
  Column,
  ForeignKey,
  Default,
  DataType,
  BelongsTo,
  DefaultScope,
  Scopes
} from 'sequelize-typescript'

import Group from './group.model'
import User from './user.model'
import { Op } from 'sequelize'
import Dialog from './dialog.model'

@Scopes(() => ({
  group: {
    include: [{ model: Group, include: ['roster'] }] // 'roster', 'messages', 'creator'
  },
  getGroup: value => {
    return {
      include: [{ model: Group, include: value }]
    }
  },
  searchLikeName: value => {
    return {
      include: [
        {
          model: Group,
          include: ['roster', 'creator'],
          where: {
            name: { [Op.like]: `%${value}%` },
          },
        },
      ],
    }
  }
}))
@DefaultScope(() => ({
  include: [{ model: User, attributes: ['id', 'username', 'fullname', 'birthdate', 'avatar', 'role', 'is_activated'] }]
}))
@Table({ tableName: 'group_roster' })
class GroupRoster extends Model<GroupRoster> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => Group)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare group_id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare user_id: string

  // Associations

  @BelongsTo(() => User)
  declare user: User

  @BelongsTo(() => Group)
  declare group: Group
}

export default GroupRoster
