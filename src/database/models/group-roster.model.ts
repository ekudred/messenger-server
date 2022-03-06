import { Model, Table, Column, IsUUID, PrimaryKey, ForeignKey } from 'sequelize-typescript'

import Group from './group.model'
import User from './user.model'

@Table({ tableName: 'group_roster' })
class GroupRoster extends Model<GroupRoster> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  declare id: string

  @ForeignKey(() => Group)
  @Column
  declare group_id: string

  @ForeignKey(() => User)
  @Column
  declare user_id: string
}

export default GroupRoster

// import { DataTypes, Model } from '@sequelize/core'

// import sequelize from '../sequelize'

// interface GroupRosterAttributes {
//   id: string
//   group_id: string
//   user_id: string
// }

// class GroupRoster extends Model<GroupRosterAttributes> {
//   declare id: string
//   declare group_id: string
//   declare user_id: string
// }

// GroupRoster.init(
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
//   },
//   {
//     tableName: 'group_roster',
//     sequelize,
//   }
// )

// export default GroupRoster
