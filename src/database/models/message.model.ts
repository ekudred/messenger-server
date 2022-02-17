import { Model, Table, Column, IsUUID, PrimaryKey, ForeignKey } from 'sequelize-typescript'

import Chat from './chat.model'
import User from './user.model'

@Table({ tableName: 'messages' })
class Message extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  public id!: string

  @ForeignKey(() => Chat)
  @Column
  public chat_id!: string

  @ForeignKey(() => User)
  @Column
  public user_id!: string

  @Column
  public content!: string
}

export default Message
