import {
  Model,
  Table,
  Column,
  ForeignKey,
  HasMany,
  Scopes,
  Default,
  BelongsTo,
  DataType,
  UpdatedAt, CreatedAt
} from 'sequelize-typescript'
import { Optional } from 'sequelize'

import User from './user.model'
import FolderDialogRoster from './folder-dialog-roster.model'
import FolderGroupRoster from './folder-group-roster.model'
import { userSafeAttributes } from '../constants'

export interface FolderAttributes {
  id: string
  user_id: string
  name: string
  updated_at: Date
  created_at: Date
}

export type FolderCreationAttributes = Optional<FolderAttributes, 'id' | 'updated_at' | 'created_at'>

@Scopes(() => ({
  roster: {
    include: [
      { model: FolderDialogRoster },
      { model: FolderGroupRoster }
    ]
  },
  user: { include: [{ model: User, attributes: userSafeAttributes }] }
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

  @BelongsTo(() => User)
  declare user: User

  @HasMany(() => FolderDialogRoster)
  declare dialogs: FolderDialogRoster[]

  @HasMany(() => FolderGroupRoster)
  declare groups: FolderGroupRoster[]
}

export default Folder
