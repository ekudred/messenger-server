import { Model, Table, Column, IsUUID, PrimaryKey, ForeignKey, HasMany, Scopes } from 'sequelize-typescript'

import User from './user.model'
import GroupRoster from './group-roster.model'
import GroupMessage from './group-message.model'
import FolderGroupRoster from './folder-group-roster.model'

@Scopes(() => ({
  roster: {
    include: [GroupRoster],
  },
  messages: {
    include: [GroupMessage],
  },
}))
@Table({ tableName: 'groups' })
class Group extends Model<Group> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  declare id: string

  @ForeignKey(() => User)
  @Column
  declare creator_id: string

  @Column
  declare name: string

  @Column
  declare image: string

  // Associations

  @HasMany(() => GroupRoster)
  declare roster: GroupRoster[]

  @HasMany(() => GroupMessage)
  declare messages: GroupMessage[]

  @HasMany(() => FolderGroupRoster)
  declare folder_group_roster: FolderGroupRoster[]
}

export default Group

// import { DataTypes, Model } from '@sequelize/core'

// import sequelize from '../sequelize'
// import GroupRoster from './group-roster.model'
// import GroupMessage from './group-message.model'

// interface GroupAttributes {
//   id: string
//   creator_id: string
//   name: string
//   image: string
// }

// class Group extends Model<GroupAttributes> {
//   declare id: string
//   declare creator_id: string
//   declare name: string
//   declare image: string
// }

// Group.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       primaryKey: true,
//     },
//     creator_id: {
//       type: DataTypes.UUID,
//     },
//     name: {
//       type: DataTypes.STRING,
//     },
//     image: {
//       type: DataTypes.STRING,
//     },
//   },
//   {
//     tableName: 'groups',
//     sequelize,
//   }
// )

// Group.hasMany(GroupRoster, { foreignKey: 'group_id' })
// GroupRoster.belongsTo(Group)

// Group.hasMany(GroupMessage, { foreignKey: 'group_id' })
// GroupRoster.belongsTo(Group)

// export default Group
