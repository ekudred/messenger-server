import { Model, Table, Column, ForeignKey, HasMany, Scopes, DataType, Default, BelongsTo } from 'sequelize-typescript'

import User from './user.model'
import GroupRoster from './group-roster.model'
import GroupMessage from './group-message.model'
import FolderGroupRoster from './folder-group-roster.model'

import { defaultGroupChatAvatarImage } from '../../utils/constants'
import { userSafeAttributes } from '../constants'

@Scopes(() => ({
  roster: {
    include: [{ model: GroupRoster }]
  },
  messages: {
    include: [{ model: GroupMessage }]
  },
  creator: {
    include: [{ model: User, attributes: userSafeAttributes }]
  }
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

  @Default(defaultGroupChatAvatarImage)
  @Column({ type: DataType.STRING })
  declare avatar: string

  // Associations

  @BelongsTo(() => User)
  declare creator: User

  @HasMany(() => GroupRoster)
  declare roster: GroupRoster[]

  @HasMany(() => GroupMessage)
  declare messages: GroupMessage[]

  @HasMany(() => FolderGroupRoster)
  declare folder_roster: FolderGroupRoster[]
}

export default Group
