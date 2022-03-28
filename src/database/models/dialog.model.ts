import { Model, Table, Column, HasMany, Scopes, Default, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'

import DialogMessage from './dialog-message.model'
import DialogRoster from './dialog-roster.model'
import FolderDialogRoster from './folder-dialog-roster.model'
import User from './user.model'

@Scopes(() => ({
  excludeAttributes: {
    attributes: { exclude: ['user_id', 'createdAt', 'updatedAt'] },
  },
  user: {
    include: [{ model: User, attributes: ['id', 'username', 'fullname', 'birthdate', 'avatar'] }],
  },
  roster: {
    include: [{ model: DialogRoster, attributes: ['id'] }],
  },
  messages: {
    include: [DialogMessage],
  },
}))
@Table({ tableName: 'dialogs' })
class Dialog extends Model<Dialog> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare user_id: string

  // Associations

  @BelongsTo(() => User)
  declare user: User

  @HasMany(() => DialogRoster)
  declare roster: DialogRoster[]

  @HasMany(() => DialogMessage)
  declare messages: DialogMessage[]

  @HasMany(() => FolderDialogRoster)
  declare folder_dialog_roster: FolderDialogRoster[]
}

export default Dialog
