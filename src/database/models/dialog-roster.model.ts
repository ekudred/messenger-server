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

export interface DialogRosterAttributes {
  id: string
  dialog_id: string
  user_id: string
  updated_at: Date
  created_at: Date
}

export type DialogRosterCreationAttributes = Optional<DialogRosterAttributes, 'id' | 'updated_at' | 'created_at'>

@Scopes(() => ({
  dialogChat: ({ whereMessages }: any) => {
    return {
      include: [{
        model: Dialog.scope([
          { method: ['roster', {}] },
          { method: ['messages', { whereMessages }] }
        ]),
        as: 'dialog'
      }]
    }
  },
  dialog: ({}: any) => {
    return {
      include: [{
        model: Dialog.scope([{ method: ['roster', {}] }, { method: ['lastMessage', {}] }, { method: ['unreadMessages', {}] }]),
        as: 'dialog'
      }]
    }
  },
  user: ({ where }: any) => {
    return {
      include: [{
        model: User.scope(['safe']),
        as: 'user',
        where
      }]
    }
  }
}))
@Table({ tableName: 'dialog_roster' })
class DialogRoster extends Model<DialogRosterAttributes, DialogRosterCreationAttributes> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  @ForeignKey(() => Dialog)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare dialog_id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare user_id: string

  @UpdatedAt
  declare updated_at: Date

  @CreatedAt
  declare created_at: Date

  // Associations

  @BelongsTo(() => Dialog)
  declare dialog: Dialog

  @BelongsTo(() => User)
  declare user: User
}

export default DialogRoster
