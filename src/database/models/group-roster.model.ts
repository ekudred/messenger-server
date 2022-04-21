import { Model, Table, Column, ForeignKey, Default, DataType, BelongsTo, DefaultScope } from 'sequelize-typescript'

import Group from './group.model'
import User from './user.model'

@DefaultScope(() => ({
  include: [{ model: User, attributes: ['id', 'username', 'fullname', 'birthdate', 'avatar', 'role'] }],
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
