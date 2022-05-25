import {
  Model,
  Table,
  Column,
  ForeignKey,
  BelongsTo,
  Scopes,
  Default,
  DefaultScope,
  DataType, UpdatedAt, CreatedAt
} from 'sequelize-typescript'
import { Op, Optional } from 'sequelize'

import Folder from './folder.model'
import Group from './group.model'

export interface FolderGroupRosterAttributes {
  id: string
  folder_id: string
  group_id: string
  updated_at: Date
  created_at: Date
}

export type FolderGroupRosterCreationAttributes = Optional<FolderGroupRosterAttributes, 'id' | 'updated_at' | 'created_at'>

@DefaultScope(() => ({
  include: [{ model: Group, include: ['roster', 'messages', 'creator'] }]
}))
@Scopes(() => ({
  searchLikeName: value => {
    return {
      include: [
        {
          model: Group,
          include: ['roster', 'messages', 'creator'],
          where: {
            name: { [Op.like]: `%${value}%` }
          }
        }
      ]
    }
  },
  group: { include: [{ model: Group, include: ['roster', 'messages', 'creator'] }] }
}))
@Table({ tableName: 'folder_group_roster' })
class FolderGroupRoster extends Model<FolderGroupRosterAttributes, FolderGroupRosterCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => Folder)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare folder_id: string

  @ForeignKey(() => Group)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare group_id: string

  @UpdatedAt
  declare updated_at: Date

  @CreatedAt
  declare created_at: Date

  // Associations

  @BelongsTo(() => Folder)
  declare folder: Folder

  @BelongsTo(() => Group)
  declare group: Group
}

export default FolderGroupRoster
