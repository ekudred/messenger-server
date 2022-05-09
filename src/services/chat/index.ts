const uuid = require('uuid')
import { Op } from 'sequelize'

import DataBase from '../../database'
import Dialog from '../../helpers/dialog'
import Group from '../../helpers/group'
import User from '../../helpers/user'
import ErrorAPI from '../../exceptions/ErrorAPI'
import {
  GetChatOptions,
  GetChatResponse,
  GetChatsOptions,
  GetChatsResponse,
  GetDialogsOptions,
  GetDialogsResponse,
  SearchChatsOptions,
  SearchChatsResponse,
  CreateDialogOptions,
  CreateDialogResponse,
  CreateGroupOptions,
  CreateGroupResponse
} from './types'

class ChatService {
  public static async getChat(options: GetChatOptions): Promise<GetChatResponse> {
    const { type, id, userID } = options

    if (type === 'dialog') {
      const dialog = await DataBase.models.Dialog.scope(['roster', 'messages']).findOne({ where: { id } })
      if (!dialog) throw ErrorAPI.badRequest('Chat not found')

      return { type: 'dialog', chat: new Dialog(dialog, userID) }
    }

    if (type === 'group') {
      const group = await DataBase.models.Group.scope(['roster', 'messages', 'creator']).findOne({ where: { id } })
      if (!group) throw ErrorAPI.badRequest('Chat not found')

      return { type: 'group', chat: new Group(group) }
    }

    if (type === 'user') {
      // const dialog = await DataBase.models.Dialog.scope([{
      //   method: ['findDialogByUsers', {
      //     user_id: userID,
      //     companion_id: id
      //   }]
      // }])
      const user = await DataBase.models.User.findOne({ where: { id } })
      if (!user) throw ErrorAPI.badRequest('Chat not found')

      return { type: 'user', chat: new User(user) }
    }

    throw ErrorAPI.badRequest('Bad Request')
  }

  public static async getChats(options: GetChatsOptions): Promise<GetChatsResponse> {
    const { userID } = options

    const userDialogs = await DataBase.models.DialogRoster.scope([{ method: ['getDialog', ['roster']] }]).findAll({ where: { user_id: userID } })
    const dialogs = userDialogs.length !== 0 ? userDialogs.map((userDialog: any) => ({
      type: 'dialog', chat: new Dialog(userDialog.dialog, userID)
    })) : []

    const userGroups = await DataBase.models.GroupRoster.scope([{ method: ['getGroup', ['roster', 'creator']] }]).findAll({ where: { user_id: userID } })
    const groups = userGroups.length !== 0 ? userGroups.map((userGroup: any) => {
      return { type: 'group', chat: new Group(userGroup.group) }
    }) : []

    const chats = [...dialogs, ...groups]

    return { chats }
  }

  public static async getDialogs(options: GetDialogsOptions): Promise<GetDialogsResponse> {
    const { userID } = options

    const userDialogs = await DataBase.models.DialogRoster.scope([{ method: ['getDialog', ['roster']] }]).findAll({ where: { user_id: userID } })
    const dialogs = userDialogs.length !== 0 ? userDialogs.map((userDialog: any) => new Dialog(userDialog.dialog, userID)) : []

    return { dialogs }
  }

  public static async searchChats(options: SearchChatsOptions): Promise<SearchChatsResponse> {
    const { value, userID } = options

    const userDialogs = await DataBase.models.DialogRoster.scope([{ method: ['getDialog', ['roster']] }]).findAll({ where: { user_id: userID } })
    const dialogs = userDialogs.map((userDialog: any) => ({
      type: 'dialog', chat: new Dialog(userDialog.dialog, userID)
    }))

    const userGroups = await DataBase.models.GroupRoster.scope([{ method: ['searchLikeName', value] }, { method: ['getGroup', ['roster', 'creator']] }]).findAll({ where: { user_id: userID } })
    const groups = userGroups.map((userGroup: any) => ({
      type: 'group', chat: new Group(userGroup.group)
    }))

    const users = await DataBase.models.User.scope(['safeAttributes']).findAll({
      where: {
        id: { [Op.not]: userID },
        username: { [Op.like]: `%${value}%` }
      }
    })

    const filteredUsers = value.trim() !== '' ? users
      .map((user: any) => ({ type: 'user', chat: new User(user) }))
      .filter((user: any) => !dialogs.some((dialog: any) => dialog.chat.companion.id === user.chat.id)) : []

    const filteredDialogs = dialogs.filter((dialog: any) => users.some((user: any) => dialog.chat.companion.id === user.id))

    const chats = [...filteredDialogs, ...groups, ...filteredUsers]

    return { chats }
  }

  public static async createDialog(options: CreateDialogOptions): Promise<CreateDialogResponse> {
    const { userID, companionID } = options

    const dialog = await DataBase.models.Dialog.create({ id: uuid.v4() })

    const dialogRosterBulkOptions = [
      { id: uuid.v4(), dialog_id: dialog.id, user_id: userID },
      { id: uuid.v4(), dialog_id: dialog.id, user_id: companionID }
    ]
    await DataBase.models.DialogRoster.bulkCreate(dialogRosterBulkOptions)

    const createdDialog = await DataBase.models.DialogRoster.scope([{ method: ['getDialog', ['roster']] }]).findOne({ where: { dialog_id: dialog.id } })

    return { dialog: new Dialog(createdDialog.dialog, userID) }
  }

  public static async createGroup(options: CreateGroupOptions): Promise<CreateGroupResponse> {
    const { creatorID, name, roster } = options // + image

    if (roster.length < 2) throw ErrorAPI.badRequest('Membership is not enough')

    const group = await DataBase.models.Group.create({ id: uuid.v4(), creator_id: creatorID, name })
    const groupRoster = [{ userID: creatorID }, ...roster]

    const groupRosterBulkOptions = groupRoster.map(item => ({
      id: uuid.v4(),
      group_id: group.id,
      user_id: item.userID
    }))
    await DataBase.models.GroupRoster.bulkCreate(groupRosterBulkOptions)

    const createdGroup = await DataBase.models.GroupRoster.scope([{ method: ['getGroup', ['roster', 'creator']] }]).findOne({ where: { group_id: group.id } })

    return { group: new Group(createdGroup.group) }
  }
}

export default ChatService
