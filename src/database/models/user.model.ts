import { Model, Table, Column, Unique, IsEmail, Is, Default, AllowNull, DataType, HasMany, Scopes } from 'sequelize-typescript'
import { Op } from 'sequelize'

import AuthToken from './auth-token.model'
import Folder from './folder.model'
import DialogRoster from './dialog-roster.model'
import DialogMessage from './dialog-message.model'
import Group from './group.model'
import GroupRoster from './group-roster.model'
import GroupMessage from './group-message.model'

import { RegExpUserName, RegExpFullName, RegExpDate, RegExpPhoneNumber, Roles, rolesArray, defaultAvatarImage } from '../../utils/constants'
import UserDialogRoster from './user-dialog-roster.model'
import UserGroupRoster from './user-group-roster.model'

@Scopes(() => ({
  safeAttributes: {
    attributes: ['id', 'username', 'fullname', 'birthdate', 'avatar', 'role'],
  },
  search: value => {
    return {
      where: {
        username: { [Op.like]: `%${value}%` },
      },
      attributes: ['id', 'username', 'fullname', 'birthdate', 'avatar', 'role'],
    }
  },
}))
@Table({ tableName: 'users' })
class User extends Model<User> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @Column({ type: DataType.STRING })
  declare password: string

  @IsEmail
  @Unique
  @Column({ type: DataType.STRING })
  declare email: string

  @Is(RegExpUserName)
  @Unique
  @Column({ type: DataType.STRING })
  declare username: string

  @AllowNull
  @Is(RegExpFullName)
  @Column({ type: DataType.STRING })
  declare fullname: string

  @AllowNull
  @Is(RegExpDate)
  @Column({ type: DataType.STRING })
  declare birthdate: string

  @AllowNull
  @Is(RegExpPhoneNumber)
  @Column({ type: DataType.STRING })
  declare phone: string

  @Default(defaultAvatarImage)
  @Column({ type: DataType.STRING })
  declare avatar: string

  @Default(Roles.USER)
  @Column({ type: DataType.ENUM(...rolesArray) })
  declare role: string

  @Column({ type: DataType.STRING })
  declare activation_link: string

  @Default(false)
  @Column({ type: DataType.STRING })
  declare is_activated: boolean

  // Associations

  @HasMany(() => AuthToken)
  declare auth_tokens: AuthToken[]

  @HasMany(() => Folder)
  declare folders: Folder[]

  @HasMany(() => UserDialogRoster)
  declare dialogs: UserDialogRoster[]

  @HasMany(() => DialogRoster)
  declare dialog_roster: DialogRoster[]

  @HasMany(() => DialogMessage)
  declare dialog_messages: DialogMessage[]

  @HasMany(() => UserGroupRoster)
  declare groups: UserGroupRoster[]

  @HasMany(() => Group)
  declare created_groups: Group[]

  @HasMany(() => GroupRoster)
  declare group_roster: GroupRoster[]

  @HasMany(() => GroupMessage)
  declare group_messages: GroupMessage[]
}

export default User
