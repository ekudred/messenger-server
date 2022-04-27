import { Model, Table, Column, ForeignKey, Default, DataType, BelongsTo, DefaultScope, HasOne, Scopes } from 'sequelize-typescript'
import { Op } from 'sequelize'

import Group from './group.model'
import User from './user.model'

@Scopes(() => ({
  group: {
    include: [{ model: Group, include: ['roster', 'messages', 'creator'] }],
  },
  search: value => {
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
  },
}))
@Table({ tableName: 'user_group_roster' })
class UserGroupRoster extends Model<UserGroupRoster> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare user_id: string

  @ForeignKey(() => Group)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare group_id: string

  // Associations

  @BelongsTo(() => User)
  declare user: User

  @BelongsTo(() => Group)
  declare group: Group
}

export default UserGroupRoster
