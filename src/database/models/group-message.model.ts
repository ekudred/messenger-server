import { Model, Table, Column, IsUUID, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript'

import User from './user.model'
import Group from './group.model'

@Table({ tableName: 'group_messages' })
class GroupMessage extends Model<GroupMessage> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  declare id: string

  @ForeignKey(() => User)
  @Column
  declare user_id: string

  @ForeignKey(() => Group)
  @Column
  declare group_id: string

  @Column
  declare content: string

  // Associations

  @BelongsTo(() => Group)
  declare group: Group
}

export default GroupMessage

// import { DataTypes, Model } from '@sequelize/core'

// import sequelize from '../sequelize'

// interface GroupMessageAttributes {
//   id: string
//   group_id: string
//   user_id: string
//   content: string
// }

// class GroupMessage extends Model<GroupMessageAttributes> {
//   declare id: string
//   declare group_id: string
//   declare user_id: string
//   declare content: string
// }

// GroupMessage.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       primaryKey: true,
//     },
//     group_id: {
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
//     tableName: 'group_messages',
//     sequelize,
//   }
// )

// export default GroupMessage
