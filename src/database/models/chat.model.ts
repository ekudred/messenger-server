import { Model, Table, Column, IsUUID, PrimaryKey, ForeignKey, Default } from 'sequelize-typescript'

import User from './user.model'

import { Chats } from '../../utils/constants'

@Table({ tableName: 'chats' })
class Chat extends Model {
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

export default Chat
