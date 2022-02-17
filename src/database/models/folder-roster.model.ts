import { Model, Table, Column, IsUUID, PrimaryKey, ForeignKey } from 'sequelize-typescript'

import Folder from './folder.model'
import Chat from './chat.model'
import User from './user.model'

@Table({ tableName: 'folder_rosters' })
class FolderRoster extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  public id!: string

  @ForeignKey(() => Folder)
  @Column
  public folder_id!: string

  @ForeignKey(() => Chat)
  @Column
  public chat_id!: string

  @ForeignKey(() => User)
  @Column
  public user_id!: string
}

export default FolderRoster
