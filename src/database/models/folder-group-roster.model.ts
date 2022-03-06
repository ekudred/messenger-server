import { Model, Table, Column, IsUUID, PrimaryKey, ForeignKey, BelongsTo, DefaultScope } from 'sequelize-typescript'

import Folder from './folder.model'
import Group from './group.model'

@DefaultScope(() => ({
  include: [Group],
}))
@Table({ tableName: 'folder_group_roster' })
class FolderGroupRoster extends Model<FolderGroupRoster> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  declare id: string

  @ForeignKey(() => Folder)
  @Column
  declare folder_id: string

  @ForeignKey(() => Group)
  @Column
  declare group_id: string

  // Associations

  @BelongsTo(() => Group)
  declare group: Group
}

export default FolderGroupRoster

// import { DataTypes, Model } from '@sequelize/core'

// import sequelize from '../sequelize'
// import Group from './group.model'

// interface FolderGroupRosterAttributes {
//   id: string
//   folder_id: string
//   group_id: string
// }

// class FolderGroupRoster extends Model<FolderGroupRosterAttributes> {
//   declare id: string
//   declare folder_id: string
//   declare group_id: string
// }

// FolderGroupRoster.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       primaryKey: true,
//     },
//     folder_id: {
//       type: DataTypes.UUID,
//     },
//     group_id: {
//       type: DataTypes.UUID,
//     },
//   },
//   {
//     tableName: 'folder_group_roster',
//     sequelize,
//   }
// )

// // FolderGroupRoster.hasOne(Group)
// // Group.belongsTo(FolderGroupRoster)

// export default FolderGroupRoster
