import {
  Model,
  Table,
  Column,
  ForeignKey,
  Default,
  BelongsTo,
  DefaultScope,
  Scopes,
  DataType
} from 'sequelize-typescript'
import { Op } from 'sequelize'

import Dialog from './dialog.model'
import User from './user.model'

@Scopes(() => ({
  dialog: {
    include: [{ model: Dialog, include: ['roster'] }] // 'roster', 'messages'
  },
  getDialog: value => {
    return {
      include: [{ model: Dialog, include: value }]
    }
  },
  searchByUsername: value => {
    return {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'fullname', 'birthdate', 'avatar', 'role', 'is_activated', 'updatedAt', 'createdAt'],
          where: {
            username: { [Op.like]: `%${value}%` }
          }
        },
        {
          model: Dialog,
          include: ['roster']
        }
      ]
    }
  },
}))
@DefaultScope(() => ({
  include: [{ model: User, attributes: ['id', 'username', 'fullname', 'birthdate', 'avatar', 'role', 'is_activated'] }]
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

  @BelongsTo(() => Dialog)
  declare dialog: Dialog
}

export default DialogRoster
