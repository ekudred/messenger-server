const uuid = require('uuid')

import { Op } from 'sequelize'

import DataBase from '../../database'
import ErrorAPI from '../../exceptions/ErrorAPI'
import TransformedDialog from '../../helpers/dialog'
import TransformedGroup from '../../helpers/group'
import TransformedUser from '../../helpers/user'
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
  HandleUserDialogOptions, HandleUserDialogResponse
} from './types'

class ChatService {
  public static async getChat(options: GetChatOptions): Promise<GetChatResponse> {
    const { type, id, userID } = options

    if (type === 'user') {
      const user = await DataBase.models.User.findOne({ where: { id } })
      if (!user) throw ErrorAPI.badRequest('User not found')

      const userDialog = await DataBase.models.UserDialog
        .scope(['dialog'])
        .findOne({ where: { user_id: userID, comrade_id: id } })

      if (!userDialog) {
        const { dialog } = await ChatService.createDialog({ userID, comradeID: id })

        return { userID, chat: { type: 'user', chat: dialog } }
      }

      return { userID, chat: { type: 'user', chat: new TransformedDialog(userDialog.dialog) } }
    }

    if (type === 'group') {
      const group = await DataBase.models.Group
        .scope(['roster', 'messages', 'creator'])
        .findOne({ where: { id } })
      if (!group) throw ErrorAPI.badRequest('Group not found')

      return { userID, chat: { type: 'group', chat: new TransformedGroup(group) } }
    }

    throw ErrorAPI.badRequest('Chat not found')
  }

  public static async getChats(options: GetChatsOptions): Promise<GetChatsResponse> {
    const { userID } = options

    const userDialogs = await DataBase.models.UserDialog
      .findAll({
        where: { user_id: userID, active: true },
        order: [[{ model: DataBase.models.Dialog, as: 'dialog' }, 'updated_messages_at', 'DESC']],
        include: [{ model: DataBase.models.Dialog, include: ['roster', 'messages'] }]
      })
    const dialogs = userDialogs.map((userDialog: any) => ({
      type: 'user', chat: new TransformedDialog(userDialog.dialog)
    }))

    const userGroups = await DataBase.models.GroupRoster
      .findAll({
        where: { user_id: userID },
        order: [[{ model: DataBase.models.Group, as: 'group' }, 'updated_messages_at', 'DESC']],
        include: [{ model: DataBase.models.Group, include: ['roster', 'messages', 'creator'] }]
      })
    const groups = userGroups.map((userGroup: any) => ({ type: 'group', chat: new TransformedGroup(userGroup.group) }))

    const chats = [...dialogs, ...groups]

    return { userID, chats }
  }

  public static async getDialogs(options: GetDialogsOptions): Promise<GetDialogsResponse> {
    const { userID } = options

    const userDialogs = await DataBase.models.UserDialog
      .scope(['dialog'])
      .findAll({ where: { user_id: userID, active: true } })
    const dialogs = userDialogs.map((userDialog: any) => new TransformedDialog(userDialog.dialog))

    return { userID, dialogs }
  }

  public static async searchChats(options: SearchChatsOptions): Promise<SearchChatsResponse> {
    const { value, userID } = options

    const userDialogs = await DataBase.models.UserDialog
      .scope(['dialog'])
      .findAll({ where: { user_id: userID, active: true } })
    const dialogs: DialogChat[] = userDialogs.map((userDialog: any) => ({
      type: 'user', chat: new TransformedDialog(userDialog.dialog)
    }))

    const userGroups = await DataBase.models.GroupRoster
      .scope([{ method: ['searchLikeName', value] }, 'group'])
      .findAll({ where: { user_id: userID } })
    const groups: GroupChat[] = userGroups.map((userGroup: any) => ({
      type: 'group', chat: new TransformedGroup(userGroup.group)
    }))

    const users = await DataBase.models.User.scope(['safeAttributes']).findAll({
      where: { id: { [Op.not]: userID }, username: { [Op.like]: `%${value}%` } }
    })

    const transformedDialogs = dialogs.map(dialog => {
      const { type, chat } = dialog
      const comrade = dialog.chat.roster.find(user => user.id !== userID)!
      return { type, chat: { ...chat, comrade } }
    })
    const filteredUsers: TransformedUser[] = value.trim() !== '' ? users
      .map((user: any) => new TransformedUser(user))
      .filter((user: any) => !transformedDialogs.some(dialog => dialog.chat.comrade.id === user.id)) : []

    const filteredDialogs = transformedDialogs.filter(dialog => users.some((user: any) => dialog.chat.comrade.id === user.id))

    const chats = [...filteredDialogs, ...groups]

    return { userID, chats, users: filteredUsers }
  }

  public static async createDialog(options: CreateDialogOptions): Promise<CreateDialogResponse> {
    const { userID, comradeID } = options

    const createdDialog = await DataBase.models.Dialog.create({ id: uuid.v4() })

    const dialogRosterBulkOptions = [
      { id: uuid.v4(), dialog_id: createdDialog.id, user_id: userID },
      { id: uuid.v4(), dialog_id: createdDialog.id, user_id: comradeID }
    ]
    await DataBase.models.DialogRoster.bulkCreate(dialogRosterBulkOptions)

    const userDialogBulkOptions = [
      { id: uuid.v4(), dialog_id: createdDialog.id, user_id: userID, comrade_id: comradeID },
      { id: uuid.v4(), dialog_id: createdDialog.id, user_id: comradeID, comrade_id: userID }
    ]
    await DataBase.models.UserDialog.bulkCreate(userDialogBulkOptions)

    const dialog = await DataBase.models.Dialog.scope(['roster', 'messages']).findOne({ where: { id: createdDialog.id } })

    return { userID, dialog: new TransformedDialog(dialog) }
  }

  public static async createGroup(options: CreateGroupOptions): Promise<CreateGroupResponse> {
    const { creatorID, name, roster } = options // + image

    if (roster.length < 2) throw ErrorAPI.badRequest('Membership is not enough')

    const createdGroup = await DataBase.models.Group.create({ id: uuid.v4(), creator_id: creatorID, name })
    const createdGroupRoster = [{ userID: creatorID }, ...roster]

    const groupRosterBulkOptions = createdGroupRoster.map(user => ({
      id: uuid.v4(), group_id: createdGroup.id, user_id: user.userID
    }))
    await DataBase.models.GroupRoster.bulkCreate(groupRosterBulkOptions)

    const group = await DataBase.models.Group.scope(['roster', 'messages', 'creator']).findOne({ where: { id: createdGroup.id } })

    return { userID: creatorID, group: new TransformedGroup(group) }
  }

  public static async handleUserDialog(options: HandleUserDialogOptions): Promise<HandleUserDialogResponse> {
    const { dialogID } = options

    const count = await DataBase.models.DialogMessage.count({ where: { dialog_id: dialogID } })

    const usersDialogs = await DataBase.models.UserDialog.scope(['dialog']).findAll({ where: { dialog_id: dialogID } })
    const active = usersDialogs.every((dialog: any) => dialog.active === true)

    await usersDialogs.forEach(async (dialog: any) => {
      if (count === 0 && active) {
        dialog.active = false
      }
      if (count !== 0 && !active) {
        dialog.active = true
      }

      await dialog.save()
    })
  }
}

export default ChatService
