import { Model, Table, Column, IsUUID, PrimaryKey, HasMany, Scopes } from 'sequelize-typescript'

import DialogMessage from './dialog-message.model'
import DialogRoster from './dialog-roster.model'
import FolderDialogRoster from './folder-dialog-roster.model'

@Scopes(() => ({
  roster: {
    include: [DialogRoster],
  },
  messages: {
    include: [DialogMessage],
  },
}))
@Table({ tableName: 'dialogs' })
class Dialog extends Model<Dialog> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  declare id: string

  // Associations

  @HasMany(() => DialogRoster)
  declare roster: DialogRoster[]

  @HasMany(() => DialogMessage)
  declare messages: DialogMessage[]

  @HasMany(() => FolderDialogRoster)
  declare folder_dialog_roster: FolderDialogRoster[]
}

export default Dialog

// import { DataTypes, Model, Association } from '@sequelize/core'

// import sequelize from '../sequelize'
// import DialogMessage from './dialog-message.model'
// import DialogRoster from './dialog-roster.model'

// interface DialogAttributes {
//   id: string
// }

// class Dialog extends Model<DialogAttributes> {
//   declare id: string
// }

// Dialog.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       primaryKey: true,
//     },
//   },
//   {
//     tableName: 'dialogs',
//     sequelize,
//     scopes: {
//       roster: {
//         include: [DialogRoster],
//       },
//       messages: {
//         include: [DialogMessage],
//       },
//     },
//   }
// )

// Dialog.hasMany(DialogRoster, { foreignKey: 'dialog_id' })
// DialogRoster.belongsTo(Dialog)

// Dialog.hasMany(DialogMessage, { foreignKey: 'dialog_id' })
// DialogMessage.belongsTo(Dialog)

// export default Dialog
