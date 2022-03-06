import { Model, Table, Column, IsUUID, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript'

import User from './user.model'
import Dialog from './dialog.model'

@Table({ tableName: 'dialog_messages' })
class DialogMessage extends Model<DialogMessage> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  declare id: string

  @ForeignKey(() => User)
  @Column
  declare user_id: string

  @ForeignKey(() => Dialog)
  @Column
  declare dialog_id: string

  @Column
  declare content: string

  // Associations

  @BelongsTo(() => Dialog)
  declare dialog: Dialog
}

export default DialogMessage

// import { DataTypes, Model } from '@sequelize/core'

// import sequelize from '../sequelize'

// interface DialogMessageAttributes {
//   id: string
//   dialog_id: string
//   user_id: string
//   content: string
// }

// class DialogMessage extends Model<DialogMessageAttributes> {
//   declare id: string
//   declare dialog_id: string
//   declare user_id: string
//   declare content: string
// }

// DialogMessage.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       primaryKey: true,
//     },
//     dialog_id: {
//       type: DataTypes.UUID,
//     },
//     user_id: {
//       type: DataTypes.UUID,
//     },
//     content: {
//       type: DataTypes.STRING,
//     },
//   },
//   {
//     tableName: 'dialog_messages',
//     sequelize,
//   }
// )

// export default DialogMessage
