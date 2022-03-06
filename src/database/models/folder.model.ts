import { Model, Table, Column, IsUUID, PrimaryKey, ForeignKey, HasMany, DefaultScope } from 'sequelize-typescript'

import User from './user.model'
import FolderDialogRoster from './folder-dialog-roster.model'
import FolderGroupRoster from './folder-group-roster.model'

@DefaultScope(() => ({
  include: [FolderDialogRoster, FolderGroupRoster],
}))
@Table({ tableName: 'folders' })
class Folder extends Model<Folder> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  declare id: string

  @ForeignKey(() => User)
  @Column
  declare user_id: string

  @Column
  declare name: string

  // Associations

  @HasMany(() => FolderDialogRoster)
  declare dialogs: FolderDialogRoster[]

  @HasMany(() => FolderGroupRoster)
  declare groups: FolderGroupRoster[]
}

export default Folder

// import { DataTypes, Model } from '@sequelize/core'

// import sequelize from '../sequelize'
// import FolderDialogRoster from './folder-dialog-roster.model'
// import FolderGroupRoster from './folder-group-roster.model'

// interface FolderAttributes {
//   id: string
//   user_id: string
//   name: string
// }

// class Folder extends Model<FolderAttributes> {
//   declare id: string
//   declare user_id: string
//   declare name: string
// }

// Folder.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       primaryKey: true,
//     },
//     user_id: {
//       type: DataTypes.UUID,
//     },
//     name: {
//       type: DataTypes.STRING,
//     },
//   },
//   {
//     tableName: 'folders',
//     sequelize,
//   }
// )

// Folder.hasMany(FolderDialogRoster, { foreignKey: 'folder_id' })
// FolderDialogRoster.belongsTo(Folder)

// Folder.hasMany(FolderGroupRoster, { foreignKey: 'folder_id' })
// FolderGroupRoster.belongsTo(Folder)

// export default Folder
