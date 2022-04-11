import { Model, Table, Column, ForeignKey, HasMany, Scopes, Default, DataType, BelongsTo } from 'sequelize-typescript'

import User from './user.model'
import FolderDialogRoster from './folder-dialog-roster.model'
import FolderGroupRoster from './folder-group-roster.model'

@Scopes(() => ({
  attributes: {
    attributes: ['id', 'name', 'user_id'],
  },
  roster: {
    include: [{ model: FolderDialogRoster }, { model: FolderGroupRoster }],
  },
}))
@Table({ tableName: 'folders' })
class Folder extends Model<Folder> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare user_id: string

  @Column({ type: DataType.STRING })
  declare name: string

  // Associations

  @BelongsTo(() => User)
  declare user: User

  @HasMany(() => FolderDialogRoster)
  declare dialogs: FolderDialogRoster[]

  @HasMany(() => FolderGroupRoster)
  declare groups: FolderGroupRoster[]
}

export default Folder
