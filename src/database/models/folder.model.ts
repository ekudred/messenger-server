import {
  Table,
  Model,
  Column,
  ForeignKey,
  HasMany,
  Default,
  BelongsTo,
  UpdatedAt,
  CreatedAt,
  Scopes,
  DataType
} from 'sequelize-typescript'
import { Optional } from 'sequelize'

import User from './user.model'
import FolderDialogRoster from './folder-dialog-roster.model'
import FolderGroupRoster from './folder-group-roster.model'

export interface FolderAttributes {
  id: string
  user_id: string
  name: string
  updated_at: Date
  created_at: Date
}

export type FolderCreationAttributes = Optional<FolderAttributes, 'id' | 'updated_at' | 'created_at'>

@Scopes(() => ({
  dialogs: ({}: any) => {
    return {
      include: [{
        model: FolderDialogRoster.scope([{ method: ['dialog', {}] }]),
        as: 'dialogs'
      }]
    }
  },
  groups: ({}: any) => {
    return {
      include: [{
        model: FolderGroupRoster.scope([{ method: ['group', {}] }]),
        as: 'groups'
      }]
    }
  },
  user: ({}: any) => {
    return {
      include: [{
        model: User.scope(['safe']),
        as: 'user'
      }]
    }
  }
}))
@Table({ tableName: 'folders' })
class Folder extends Model<FolderAttributes, FolderCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare user_id: string

  @Column({ type: DataType.STRING })
  declare name: string

  @UpdatedAt
  declare updated_at: Date

  @CreatedAt
  declare created_at: Date

  // Associations

  @HasMany(() => FolderDialogRoster)
  declare dialogs: FolderDialogRoster[]

  @HasMany(() => FolderGroupRoster)
  declare groups: FolderGroupRoster[]

  @BelongsTo(() => User)
  declare user: User
}

export default Folder
