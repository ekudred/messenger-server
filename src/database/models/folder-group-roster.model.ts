import { Model, Table, Column, ForeignKey, BelongsTo, DefaultScope, Scopes, Default, DataType } from 'sequelize-typescript'

import Folder from './folder.model'
import Group from './group.model'

@DefaultScope(() => ({
  include: [{ model: Group, include: ['roster', 'creator'] }],
}))
@Table({ tableName: 'folder_group_roster' })
class FolderGroupRoster extends Model<FolderGroupRoster> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => Folder)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare folder_id: string

  @ForeignKey(() => Group)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare group_id: string

  // Associations

  @BelongsTo(() => Folder)
  declare folder: Folder

  @BelongsTo(() => Group)
  declare group: Group
}

export default FolderGroupRoster
