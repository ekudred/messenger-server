import { Model, Table, Column, HasMany, Scopes, Default, DataType } from 'sequelize-typescript'

import DialogMessage from './dialog-message.model'
import DialogRoster from './dialog-roster.model'
import FolderDialogRoster from './folder-dialog-roster.model'

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

  @HasMany(() => FolderDialogRoster)
  declare folder_roster: FolderDialogRoster[]

  @HasMany(() => DialogRoster)
  declare roster: DialogRoster[]

  @HasMany(() => DialogMessage)
  declare messages: DialogMessage[]
}

export default Dialog
