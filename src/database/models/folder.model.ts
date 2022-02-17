import { Model, Table, Column, IsUUID, PrimaryKey, ForeignKey } from 'sequelize-typescript'

import User from './user.model'

@Table({ tableName: 'folders' })
class Folder extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  public id!: string

  @ForeignKey(() => User)
  @Column
  public user_id!: string

  @Column
  public name!: string
}

export default Folder