import { Model, Table, Column, ForeignKey, DataType, Default, BelongsTo, DefaultScope } from 'sequelize-typescript'

import Dialog from './dialog.model'
import User from './user.model'

@DefaultScope(() => ({
  include: [{ model: User, attributes: ['id', 'username', 'fullname', 'birthdate', 'avatar'] }],
}))
@Table({ tableName: 'dialog_roster' })
class DialogRoster extends Model<DialogRoster> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => Dialog)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare dialog_id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare user_id: string

  // Associations

  @BelongsTo(() => User)
  declare user: User
}

export default DialogRoster
