import {
  Table,
  Model,
  Column,
  ForeignKey,
  Default,
  BelongsTo,
  UpdatedAt,
  CreatedAt,
  Scopes,
  DataType
} from 'sequelize-typescript'
import { Optional } from 'sequelize'

import User from './user.model'
import Dialog from './dialog.model'

export interface UserDialogAttributes {
  id: string
  user_id: string
  comrade_id: string
  dialog_id: string
  active: boolean
  updated_at: Date
  created_at: Date
}

export type UserDialogCreationAttributes = Optional<UserDialogAttributes, 'id' | 'updated_at' | 'created_at'>

@Scopes(() => ({
  dialogChat: ({ whereMessages }: any) => {
    return {
      include: [{
        model: Dialog.scope([
          { method: ['roster', {}] },
          { method: ['messages', { whereMessages }] },
        ]),
        as: 'dialog'
      }]
    }
  },
  dialog: ({}: any) => {
    return {
      include: [{
        model: Dialog.scope([
          { method: ['roster', {}] },
          { method: ['lastMessage', {}] },
          { method: ['unreadMessages', {}] }
        ]),
        as: 'dialog'
      }]
    }
  },
  user: ({}: any) => {
    return { include: [{ model: User.scope(['safe']), as: 'user' }] }
  },
  comrade: ({ where }: any) => {
    return { include: [{ model: User.scope(['safe']), where, as: 'comrade' }] }
  }
}))
@Table({ tableName: 'user_dialogs' })
class UserDialog extends Model<UserDialogAttributes, UserDialogCreationAttributes> {
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

  @UpdatedAt
  declare updated_at: Date

  @CreatedAt
  declare created_at: Date

  // Associations

  @BelongsTo(() => User, { foreignKey: 'user_id' })
  declare user: User

  @BelongsTo(() => User, { foreignKey: 'comrade_id' })
  declare comrade: User

  @BelongsTo(() => Dialog)
  declare dialog: Dialog
}

export default UserDialog