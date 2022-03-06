import { Model, Table, Column, IsUUID, PrimaryKey, ForeignKey } from 'sequelize-typescript'

import Dialog from './dialog.model'
import User from './user.model'

@Table({ tableName: 'dialog_roster' })
class DialogRoster extends Model<DialogRoster> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  declare id: string

  @ForeignKey(() => Dialog)
  @Column
  declare dialog_id: string

  @ForeignKey(() => User)
  @Column
  declare user_id: string
}

export default DialogRoster

// import { DataTypes, Model } from '@sequelize/core'

// import sequelize from '../sequelize'

// interface DialogRosterAttributes {
//   id: string
//   dialog_id: string
//   user_id: string
// }

// class DialogRoster extends Model<DialogRosterAttributes> {
//   declare id: string
//   declare dialog_id: string
//   declare user_id: string
// }

// DialogRoster.init(
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
//   },
//   {
//     tableName: 'dialog_roster',
//     sequelize,
//   }
// )

// export default DialogRoster
