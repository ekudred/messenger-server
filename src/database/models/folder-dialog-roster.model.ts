import { Model, Table, Column, ForeignKey, BelongsTo, DefaultScope, DataType, Default, HasOne } from 'sequelize-typescript'

import Folder from './folder.model'
import Dialog from './dialog.model'

@DefaultScope(() => ({
  include: [{ model: Dialog }],
}))
@Table({ tableName: 'folder_dialog_roster' })
class FolderDialogRoster extends Model<FolderDialogRoster> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => Folder)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare folder_id: string

  @ForeignKey(() => Dialog)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare dialog_id: string

  // Associations

  @BelongsTo(() => Folder)
  declare folder: Folder

  @BelongsTo(() => Dialog)
  declare dialog: Dialog
}

export default FolderDialogRoster
