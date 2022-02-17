import { Model, Table, Column, IsUUID, PrimaryKey, ForeignKey } from 'sequelize-typescript'

import Chat from './chat.model'
import User from './user.model'

@Table({ tableName: 'chat_rosters' })
class ChatRoster extends Model {
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
}

export default ChatRoster
