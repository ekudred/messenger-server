import { Model, Table, Column, Scopes, Default, HasMany, CreatedAt, UpdatedAt, DataType } from 'sequelize-typescript'
import { Optional } from 'sequelize'

import DialogMessage from './dialog-message.model'
import DialogRoster from './dialog-roster.model'
import FolderDialogRoster from './folder-dialog-roster.model'

export interface DialogAttributes {
  id: string
  updated_messages_at: Date
  updated_at: Date
  created_at: Date
}

export type DialogCreationAttributes = Optional<DialogAttributes, 'id' | 'updated_at' | 'created_at'>

@Scopes(() => ({
  roster: { include: [{ model: DialogRoster }] },
  messages: { include: [{ model: DialogMessage, include: ['unread'] }] }
}))
@Table({ tableName: 'dialogs' })
class Dialog extends Model<DialogAttributes, DialogCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE })
  declare updated_messages_at: Date

  @UpdatedAt
  declare updated_at: Date

  @CreatedAt
  declare created_at: Date

  // Associations

  @HasMany(() => DialogRoster)
  declare roster: DialogRoster[]

  @HasMany(() => DialogMessage)
  declare messages: DialogMessage[]

  @HasMany(() => FolderDialogRoster)
  declare folder_roster: FolderDialogRoster[]
}

export default Dialog
