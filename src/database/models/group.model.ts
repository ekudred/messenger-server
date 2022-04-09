import { Model, Table, Column, ForeignKey, HasMany, Scopes, DataType, Default, BelongsTo } from 'sequelize-typescript'

import User from './user.model'
import GroupRoster from './group-roster.model'
import GroupMessage from './group-message.model'
import FolderGroupRoster from './folder-group-roster.model'
import UserGroupRoster from './user-group-roster.model'

import { defaultAvatarImage } from '../../utils/constants'

@Scopes(() => ({
  roster: {
    include: [{ model: GroupRoster }],
  },
  messages: {
    include: [{ model: GroupMessage }],
  },
  creator: {
    include: [{ model: User, attributes: ['id', 'username', 'fullname', 'birthdate', 'avatar'] }],
  },
}))
@Table({ tableName: 'groups' })
class Group extends Model<Group> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare creator_id: string

  @Column({ type: DataType.STRING })
  declare name: string

  @Default(defaultAvatarImage)
  @Column({ type: DataType.STRING })
  declare image: string

  // Associations

  @BelongsTo(() => User)
  declare creator: User

  @HasMany(() => UserGroupRoster)
  declare user_roster: UserGroupRoster[]

  @HasMany(() => FolderGroupRoster)
  declare folder_roster: FolderGroupRoster[]

  @HasMany(() => GroupRoster)
  declare roster: GroupRoster[]

  @HasMany(() => GroupMessage)
  declare messages: GroupMessage[]
}

export default Group
