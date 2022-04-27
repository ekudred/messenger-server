import { Model, Table, Column, ForeignKey, BelongsTo, DataType, Default } from 'sequelize-typescript'

import User from './user.model'
import Group from './group.model'

@Table({ tableName: 'group_messages' })
class GroupMessage extends Model<GroupMessage> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare user_id: string

  @ForeignKey(() => Group)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare group_id: string

  @Column({ type: DataType.STRING })
  declare text: string

  // Associations

  @BelongsTo(() => User)
  declare user: User

  @BelongsTo(() => Group)
  declare group: Group
}

export default GroupMessage
