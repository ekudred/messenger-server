import {
  Table,
  Model,
  Column,
  ForeignKey,
  BelongsTo,
  Default,
  UpdatedAt,
  CreatedAt,
  Scopes,
  DataType
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
  group: ({ where }: any) => {
    return {
      include: [{
        model: Group.scope([
          { method: ['roster', {}] },
          { method: ['lastMessage', {}] },
          { method: ['creator', {}] },
          { method: ['unreadMessages', {}] }
        ]),
        as: 'group',
        where
      }]
    }
  }
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
