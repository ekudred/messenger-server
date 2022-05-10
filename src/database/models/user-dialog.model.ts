import {
  Model,
  Table,
  Column,
  ForeignKey,
  Default,
  BelongsTo,
  // DefaultScope,
  Scopes,
  DataType
} from 'sequelize-typescript'
// import { Op } from 'sequelize'

import Dialog from './dialog.model'
import User from './user.model'

@Scopes(() => ({
  dialog: {
    include: [{ model: Dialog, include: ['roster', 'messages'] }] // 'roster', 'messages'
  },
  getDialog: value => {
    return {
      include: [{ model: Dialog, include: value }]
    }
  },
}))
@Table({ tableName: 'user_dialogs' })
class UserDialog extends Model<UserDialog> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare user_id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare comrade_id: string

  @ForeignKey(() => Dialog)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare dialog_id: string

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare active: boolean

  // Associations

  @BelongsTo(() => User)
  declare user: User

  @BelongsTo(() => User)
  declare comrade: User

  @BelongsTo(() => Dialog)
  declare dialog: Dialog
}

export default UserDialog