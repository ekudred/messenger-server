import { Model, Table, Column, IsUUID, PrimaryKey, ForeignKey, DataType } from 'sequelize-typescript'

import User from './user.model'

@Table({ tableName: 'tokens' })
class Token extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  public id!: string

  @ForeignKey(() => User)
  @Column
  public user_id!: string

  @Column
  public client_id!: string

  @Column(DataType.STRING(1234))
  @Column
  public refresh_token!: string
}

export default Token
