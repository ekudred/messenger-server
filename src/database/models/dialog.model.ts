import { Model, Table, Column, HasMany, Scopes, Default, DataType } from 'sequelize-typescript'

import DialogMessage from './dialog-message.model'
import DialogRoster from './dialog-roster.model'
import FolderDialogRoster from './folder-dialog-roster.model'
import UserDialogRoster from './user-dialog-roster.model'

@Scopes(() => ({
  roster: {
    include: [{ model: DialogRoster }],
  },
  messages: {
    include: [{ model: DialogMessage }],
  },
}))
@Table({ tableName: 'dialogs' })
class Dialog extends Model<Dialog> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  // Associations

  @HasMany(() => UserDialogRoster)
  declare user_roster: UserDialogRoster[]

  @HasMany(() => FolderDialogRoster)
  declare folder_roster: FolderDialogRoster[]

  @HasMany(() => DialogRoster)
  declare roster: DialogRoster[]

  @HasMany(() => DialogMessage)
  declare messages: DialogMessage[]
}

export default Dialog
