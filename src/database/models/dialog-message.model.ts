import { Model, Table, Column, ForeignKey, BelongsTo, Default, DataType } from 'sequelize-typescript'

import User from './user.model'
import Dialog from './dialog.model'

@Table({ tableName: 'dialog_messages' })
class DialogMessage extends Model<DialogMessage> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare user_id: string

  @ForeignKey(() => Dialog)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare dialog_id: string

  @Column
  declare content: string

  // Associations

  @BelongsTo(() => User)
  declare user: User

  @BelongsTo(() => Dialog)
  declare dialog: Dialog
}

export default DialogMessage
