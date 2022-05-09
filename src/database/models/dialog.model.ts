import { Model, Table, Column, HasMany, Scopes, Default, DataType } from 'sequelize-typescript'
import { Op } from 'sequelize'

import DialogMessage from './dialog-message.model'
import DialogRoster from './dialog-roster.model'
import FolderDialogRoster from './folder-dialog-roster.model'

@Scopes(() => ({
  roster: {
    include: [{ model: DialogRoster }]
  },
  messages: {
    include: [{ model: DialogMessage }]
  },
  findDialogByUsers: ({ user_id, companion_id }) => {
    return {
      include: [
        {
          model: DialogRoster,
          where: {
            roster: {
              [Op.contains]: {
                user_id
              },
              [Op.contains]: {
                user_id: companion_id
              }
            }
          }
        }
      ]
    }
  }
}))
@Table({ tableName: 'dialogs' })
class Dialog extends Model<Dialog> {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string

  // Associations

  @HasMany(() => DialogRoster)
  declare roster: DialogRoster[]

  @HasMany(() => DialogMessage)
  declare messages: DialogMessage[]

  @HasMany(() => FolderDialogRoster)
  declare folder_roster: FolderDialogRoster[]
}

export default Dialog
