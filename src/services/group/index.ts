import { Op } from 'sequelize'

import DataBase from '../../database'
import ErrorAPI from '../../exceptions/ErrorAPI'
import {
  CreateGroupOptions,
  CreateGroupResponse,
  FindGroupsOptions,
  FindGroupsResponse,
  FindGroupOptions,
  FindGroupResponse,
  SearchGroupsOptions,
  SearchGroupsResponse
} from './types'
import TransformedGroup from '../../helpers/group'

class GroupService {
  static async createGroup(options: CreateGroupOptions): Promise<CreateGroupResponse> {
    const { creatorID, name, roster } = options // + image

    if (roster.length < 2) throw ErrorAPI.badRequest('Membership is not enough')

    const createdGroup = await DataBase.models.Group.create({ creator_id: creatorID, name })

    const createdGroupRoster = [{ userID: creatorID }, ...roster]
    const groupRosterBulkOptions = createdGroupRoster.map(user => ({ group_id: createdGroup.id, user_id: user.userID }))
    await DataBase.models.GroupRoster.bulkCreate(groupRosterBulkOptions)

    return await this.findGroup({ id: createdGroup.id })
  }

  static async findGroups(options: FindGroupsOptions): Promise<FindGroupsResponse> {
    const { userID } = options

    const groupsRoster = await DataBase.models.GroupRoster
      .scope([{ method: ['group', {}] }])
      .findAll({
        where: { user_id: userID },
        order: [[
          { model: DataBase.models.Group, as: 'group' },
          { model: DataBase.models.GroupLastMessage, as: 'last_message' },
          'updated_at', 'DESC'
        ]]
      })

    return groupsRoster.map((item: any) => new TransformedGroup(item.group))
  }

  static async findGroup(options: FindGroupOptions): Promise<FindGroupResponse> {
    const { id } = options

    const group = await DataBase.models.Group
      .scope([{
        method: ['roster', {}] },
        { method: ['lastMessage', {}] },
        { method: ['creator', {}] },
        { method: ['unreadMessages', {}] }
      ])
      .findOne({ where: { id } })

    return new TransformedGroup(group)
  }

  static async searchGroups(options: SearchGroupsOptions): Promise<SearchGroupsResponse> {
    const { userID, value } = options

    const groupsRoster = await DataBase.models.GroupRoster
      .scope([{ method: ['group', { where: { name: { [Op.like]: `%${value}%` } } }] }])
      .findAll({
        where: { user_id: userID },
        order: [[
          { model: DataBase.models.Group, as: 'group' },
          { model: DataBase.models.GroupLastMessage, as: 'last_message' },
          'updated_at', 'DESC'
        ]]
      })

    return groupsRoster.map((item: any) => new TransformedGroup(item.group))
  }
}


export default GroupService