import { Model, Table, Column, IsUUID, PrimaryKey, ForeignKey, BelongsTo, DefaultScope } from 'sequelize-typescript'

import Folder from './folder.model'
import Dialog from './dialog.model'

@DefaultScope(() => ({
  include: [Dialog],
}))
@Table({ tableName: 'folder_dialog_roster' })
class FolderDialogRoster extends Model<FolderDialogRoster> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  declare id: string

  @ForeignKey(() => Folder)
  @Column
  declare folder_id: string

  @ForeignKey(() => Dialog)
  @Column
  declare dialog_id: string

  // Associations

  @BelongsTo(() => Dialog)
  declare dialog: Dialog
}

export default FolderDialogRoster

// import { DataTypes, Model } from '@sequelize/core'

// import sequelize from '../sequelize'
// import Dialog from './dialog.model'

// interface FolderDialogRosterAttributes {
//   id: string
//   folder_id: string
//   dialog_id: string
// }

// class FolderDialogRoster extends Model<FolderDialogRosterAttributes> {
//   declare id: string
//   declare folder_id: string
//   declare dialog_id: string
// }

// FolderDialogRoster.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       primaryKey: true,
//     },
//     folder_id: {
//       type: DataTypes.UUID,
//     },
//     dialog_id: {
//       type: DataTypes.UUID,
//     },
//   },
//   {
//     tableName: 'folder_dialog_roster',
//     sequelize,
//   }
// )

// // FolderDialogRoster.hasOne(Dialog)
// // Dialog.belongsTo(FolderDialogRoster)

// export default FolderDialogRoster