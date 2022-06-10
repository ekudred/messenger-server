import {
  Table,
  Model,
  Column,
  ForeignKey,
  BelongsTo,
  Default,
  UpdatedAt,
  CreatedAt,
  DataType,
  Scopes
} from 'sequelize-typescript'
import { Optional } from 'sequelize'

import Folder from './folder.model'
import Dialog from './dialog.model'

export interface FolderDialogRosterAttributes {
  id: string
  folder_id: string
  dialog_id: string
  updated_at: Date
  created_at: Date
}

export type FolderDialogRosterCreationAttributes = Optional<FolderDialogRosterAttributes, 'id' | 'updated_at' | 'created_at'>

@Scopes(() => ({
  folder: ({}: any) => {
    return {
      include: [{
        model: Folder.scope([
          { method: ['dialogs', {}] },
          { method: ['groups', {}] }
        ]),
        as: 'folder'
      }]
    }
  },
  dialog: ({}: any) => {
    return {
      include: [{
        model: Dialog.scope([
          { method: ['roster', {}] },
          { method: ['lastMessage', {}] },
          { method: ['unreadMessages', {}] }
        ]),
        as: 'dialog'
      }]
    }
  }
}))
@Table({ tableName: 'folder_dialog_roster' })
class FolderDialogRoster extends Model<FolderDialogRosterAttributes, FolderDialogRosterCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => Folder)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare folder_id: string

  @ForeignKey(() => Dialog)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare dialog_id: string

  @UpdatedAt
  declare updated_at: Date

  @CreatedAt
  declare created_at: Date

  // Associations

  @BelongsTo(() => Folder)
  declare folder: Folder

  @BelongsTo(() => Dialog)
  declare dialog: Dialog
}

export default FolderDialogRoster
