const uuid = require('uuid')

import { Op } from 'sequelize'

import DataBase from '../../database'
import ErrorAPI from '../../exceptions/ErrorAPI'
import Dialog from '../../helpers/dialog'
import Group from '../../helpers/group'
import User from '../../helpers/user'
import {
  DialogChat,
  GroupChat,
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
  CreateGroupResponse,
  HandleUserDialogActiveOptions, HandleUserDialogActiveResponse
} from './types'

class ChatService {
  public static async getChat(options: GetChatOptions): Promise<GetChatResponse> {
    const { type, id, userID } = options

    if (type === 'user') {
      const user = await DataBase.models.User.findOne({ where: { id } })
      if (!user) throw ErrorAPI.badRequest('User not found')

      const userDialog = await DataBase.models.UserDialog.scope(['dialog']).findOne({
        where: { user_id: userID, comrade_id: id }
      })

      if (!userDialog) {
        const { dialog } = await ChatService.createDialog({ userID, comradeID: id })

        return { type: 'user', chat: dialog }
      }

      return { type: 'user', chat: new Dialog(userDialog.dialog, userID) }
    }

    if (type === 'group') {
      const group = await DataBase.models.Group.scope(['roster', 'messages', 'creator']).findOne({ where: { id } })
      if (!group) throw ErrorAPI.badRequest('Group not found')

      return { type: 'group', chat: new Group(group) }
    }

    throw ErrorAPI.badRequest('Bad Request')
  }

  public static async getChats(options: GetChatsOptions): Promise<GetChatsResponse> {
    const { userID } = options

    // dialogs
    const userDialogs = await DataBase.models.UserDialog.scope([{ method: ['getDialog', ['roster']] }]).findAll({
      where: { user_id: userID, active: true }
    })
    const dialogs = userDialogs.map((userDialog: any) => ({ type: 'user', chat: new Dialog(userDialog.dialog, userID) }))

    // groups
    const userGroups = await DataBase.models.GroupRoster.scope([{ method: ['getGroup', ['roster', 'creator']] }]).findAll({
      where: { user_id: userID }
    })
    const groups = userGroups.map((userGroup: any) => ({ type: 'group', chat: new Group(userGroup.group) }))

    const chats = [...dialogs, ...groups]

    return { chats }
  }

  public static async getDialogs(options: GetDialogsOptions): Promise<GetDialogsResponse> {
    const { userID } = options

    const userDialogs = await DataBase.models.UserDialog.scope([{ method: ['getDialog', ['roster']] }]).findAll({
      where: { user_id: userID, active: true }
    })
    const dialogs = userDialogs.map((userDialog: any) => new Dialog(userDialog.dialog, userID))

    return { dialogs }
  }

  public static async searchChats(options: SearchChatsOptions): Promise<SearchChatsResponse> {
    const { value, userID } = options

    const userDialogs = await DataBase.models.UserDialog.scope([{ method: ['getDialog', ['roster']] }]).findAll({
      where: { user_id: userID, active: true }
    })
    const dialogs: DialogChat[] = userDialogs.map((userDialog: any) => ({
      type: 'user',
      chat: new Dialog(userDialog.dialog, userID)
    }))

    const userGroups = await DataBase.models.GroupRoster.scope([{ method: ['searchLikeName', value] }, { method: ['getGroup', ['roster', 'creator']] }]).findAll({
      where: { user_id: userID }
    })
    const groups: GroupChat[] = userGroups.map((userGroup: any) => ({
      type: 'group',
      chat: new Group(userGroup.group)
    }))

    const users = await DataBase.models.User.scope(['safeAttributes']).findAll({
      where: { id: { [Op.not]: userID }, username: { [Op.like]: `%${value}%` } }
    })

    const filteredUsers: User[] = value.trim() !== '' ? users
      .map((user: any) => new User(user))
      .filter((user: any) => !dialogs.some(dialog => dialog.chat.comrade.id === user.id)) : []

    const filteredDialogs = dialogs.filter(dialog => users.some((user: any) => dialog.chat.comrade.id === user.id))

    const chats = [...filteredDialogs, ...groups]

    return { chats, users: filteredUsers }
  }

  public static async createDialog(options: CreateDialogOptions): Promise<CreateDialogResponse> {
    const { userID, comradeID } = options

    const dialog = await DataBase.models.Dialog.create({ id: uuid.v4() })

    const dialogRosterBulkOptions = [
      { id: uuid.v4(), dialog_id: dialog.id, user_id: userID },
      { id: uuid.v4(), dialog_id: dialog.id, user_id: comradeID }
    ]
    await DataBase.models.DialogRoster.bulkCreate(dialogRosterBulkOptions)

    const userDialogBulkOptions = [
      { id: uuid.v4(), dialog_id: dialog.id, user_id: userID, comrade_id: comradeID },
      { id: uuid.v4(), dialog_id: dialog.id, user_id: comradeID, comrade_id: userID }
    ]
    await DataBase.models.UserDialog.bulkCreate(userDialogBulkOptions)

    const createdDialog = await DataBase.models.DialogRoster.scope(['dialog']).findOne({ where: { dialog_id: dialog.id } })

    return { dialog: new Dialog(createdDialog.dialog, userID) }
  }

  public static async createGroup(options: CreateGroupOptions): Promise<CreateGroupResponse> {
    const { creatorID, name, roster } = options // + image

    if (roster.length < 2) throw ErrorAPI.badRequest('Membership is not enough')

    const group = await DataBase.models.Group.create({ id: uuid.v4(), creator_id: creatorID, name })
    const groupRoster = [{ userID: creatorID }, ...roster]

    const groupRosterBulkOptions = groupRoster.map(user => ({
      id: uuid.v4(), group_id: group.id, user_id: user.userID
    }))
    await DataBase.models.GroupRoster.bulkCreate(groupRosterBulkOptions)

    const createdGroup = await DataBase.models.GroupRoster.scope(['group']).findOne({ where: { group_id: group.id } })

    return { group: new Group(createdGroup.group) }
  }

  public static async handleUserDialogActive(options: HandleUserDialogActiveOptions): Promise<HandleUserDialogActiveResponse> {
    const { dialogID } = options

    const count = await DataBase.models.DialogMessage.count({ where: { dialog_id: dialogID } })

    const usersDialogs = await DataBase.models.UserDialog.scope(['dialog']).findAll({ where: { dialog_id: dialogID } })
    const active = usersDialogs.every((dialog: any) => dialog.active === true)

    let created = false

    usersDialogs.forEach((dialog: any) => {
      if (count === 0 && active) {
        dialog.active = false
      }
      if (count !== 0 && !active) {
        created = true
        dialog.active = true
      }

      dialog.save()
    })
    // dialog: active ? new Dialog(usersDialogs[0].dialog,)

    return { created }
  }
}

export default ChatService
