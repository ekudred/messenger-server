import { Model, Table, Column, ForeignKey, Default, DataType, BelongsTo, DefaultScope, Scopes, HasOne } from 'sequelize-typescript'
import { Op } from 'sequelize'

import Dialog from './dialog.model'
import User from './user.model'

@Scopes(() => ({
  dialog: {
    include: [{ model: Dialog, include: ['roster'] }],
  },
  search: value => {
    return {
      include: [
        {
          model: User,
          where: {
            username: { [Op.like]: `%${value}%` },
          },
        },
        {
          model: Dialog,
          include: ['roster'],
        },
      ],
    }
  },
}))
@Table({ tableName: 'user_dialog_roster' })
class UserDialogRoster extends Model<UserDialogRoster> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare user_id: string

  @ForeignKey(() => Dialog)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare dialog_id: string

  // Associations

  @BelongsTo(() => User)
  declare user: User

  @BelongsTo(() => Dialog)
  declare dialog: Dialog
}

export default UserDialogRoster
