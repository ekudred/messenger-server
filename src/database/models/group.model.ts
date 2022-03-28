import { Model, Table, Column, ForeignKey, HasMany, Scopes, DataType, Default, BelongsTo } from 'sequelize-typescript'

import User from './user.model'
import GroupRoster from './group-roster.model'
import GroupMessage from './group-message.model'
import FolderGroupRoster from './folder-group-roster.model'

@Scopes(() => ({
  excludeAttributes: {
    attributes: { exclude: ['user_id', 'createdAt', 'updatedAt'] },
  },
  user: {
    include: [{ model: User, attributes: ['id', 'username', 'fullname', 'birthdate', 'avatar'] }],
  },
  roster: {
    include: [{ model: GroupRoster, attributes: ['id'] }],
  },
  messages: {
    include: [GroupMessage],
  },
}))
@Table({ tableName: 'groups' })
class Group extends Model<Group> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare user_id: string

  @Column({ type: DataType.STRING })
  declare name: string

  @Column({ type: DataType.STRING })
  declare image: string

  // Associations

  @BelongsTo(() => User)
  declare user: User

  @HasMany(() => GroupRoster)
  declare roster: GroupRoster[]

  @HasMany(() => GroupMessage)
  declare messages: GroupMessage[]

  @HasMany(() => FolderGroupRoster)
  declare folder_group_roster: FolderGroupRoster[]
}

export default Group
