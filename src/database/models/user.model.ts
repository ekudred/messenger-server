import {
  Model,
  Table,
  Column,
  Unique,
  IsEmail,
  Is,
  Default,
  AllowNull,
  DataType,
  HasMany,
  Scopes
} from 'sequelize-typescript'
import { Op } from 'sequelize'

import AuthToken from './auth-token.model'
import Folder from './folder.model'
import UserDialog from './user-dialog.model'
import DialogRoster from './dialog-roster.model'
import DialogMessage from './dialog-message.model'
import Group from './group.model'
import GroupRoster from './group-roster.model'
import GroupMessage from './group-message.model'

import {
  RegExpUserName,
  RegExpFullName,
  RegExpDate,
  RegExpPhoneNumber,
  Roles,
  rolesArray,
  defaultAvatarImage
} from '../../utils/constants'
import { userSafeAttributes } from '../constants'

@Scopes(() => ({
  safeAttributes: {
    attributes: userSafeAttributes
  },
  search: value => {
    return {
      where: {
        username: { [Op.like]: `%${value}%` }
      },
      attributes: userSafeAttributes
    }
  }
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
  @Column({ type: DataType.BOOLEAN })
  declare is_activated: boolean

  // Associations

  @HasMany(() => AuthToken)
  declare auth_tokens: AuthToken[]

  @HasMany(() => Folder)
  declare folders: Folder[]

  @HasMany(() => UserDialog)
  declare user_dialogs: UserDialog[]

  @HasMany(() => DialogRoster)
  declare dialog_roster: DialogRoster[]

  @HasMany(() => DialogMessage)
  declare dialog_messages: DialogMessage[]

  @HasMany(() => Group)
  declare created_groups: Group[]

  @HasMany(() => GroupRoster)
  declare group_roster: GroupRoster[]

  @HasMany(() => GroupMessage)
  declare group_messages: GroupMessage[]
}

export default User
