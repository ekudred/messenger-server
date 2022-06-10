import { Op } from 'sequelize'

import DataBase from '../../database'
import ErrorAPI from '../../exceptions/ErrorAPI'
import DialogService from '../dialog'
import GroupService from '../group'
import UserService from '../user'
import TransformedDialog from '../../helpers/dialog'
import TransformedGroup from '../../helpers/group'
import {
  DialogChat,
  GroupChat,
  GetChatOptions,
  GetChatResponse,
  GetChatsOptions,
  GetChatsResponse,
  SearchChatsOptions,
  SearchChatsResponse
} from './types'
import { sortChats } from '../../helpers/common'

class ChatService {
  static async getChat(options: GetChatOptions): Promise<GetChatResponse> {
    const { type, id, userID } = options

    if (type === 'user') {
      const user = await DataBase.models.User.findOne({ where: { id } })
      if (!user) throw ErrorAPI.badRequest('User not found')

      const checkUserDialog = await DataBase.models.UserDialog.findOne({ where: { user_id: userID, comrade_id: id } })
      if (!checkUserDialog) {
        const dialog = await DialogService.createDialog({ userID, comradeID: id })
        return { type: 'user', chat: dialog, created: true }
      }

      const unreadMessages = await DataBase.models.DialogMessageUnread
        .scope([
          { method: ['rosterItem', { where: { user_id: userID } }] },
          { method: ['message', {}] }
        ])
        .findAll({ where: { dialog_id: id } })

      // const firstUnreadMessage = unreadMessages[0]
      // const firstUnreadMessageCreatedAt = new Date(firstUnreadMessage.message.created_at)
      //
      // const start = firstUnreadMessageCreatedAt.setDate(firstUnreadMessageCreatedAt.getDate() - 1)
      // const end = new Date()

      // messages where: { created_at: { [Op.between]: [start, end] } }
      const userDialog = await DataBase.models.UserDialog
        .scope([{ method: ['dialogChat', {}] }])
        .findOne({
          where: { user_id: userID, comrade_id: id },
          order: [[
            { model: DataBase.models.Dialog, as: 'dialog' },
            { model: DataBase.models.DialogMessage, as: 'messages' },
            'created_at', 'ASC'
          ]]
        })

      // order: [
      //   // [
      //   //   { model: DataBase.models.Dialog, as: 'dialog' },
      //   //   { model: DataBase.models.DialogMessage, as: 'messages' },
      //   //   'created_at', 'ASC'
      //   // ]
      // ]

      return { type: 'user', chat: new TransformedDialog(userDialog.dialog), created: false }
    }

    if (type === 'group') {
      // const unreadMessages = await DataBase.models.GroupMessageUnread
      //   .scope([
      //     { method: ['rosterItem', { where: { user_id: userID } }] },
      //     { method: ['message', {}] }
      //   ])
      //   .findAll({ where: { group_id: id } })
      //
      // const firstUnreadMessage = unreadMessages[0]
      //
      // const firstUnreadMessageCreatedAt = new Date(firstUnreadMessage.message.created_at)
      //
      // const start = firstUnreadMessageCreatedAt.setDate(firstUnreadMessageCreatedAt.getDate() - 1)
      // const end = new Date()

      // messages  where: { created_at: { [Op.between]: [start, end] } }

      const group = await DataBase.models.Group
        .scope([{ method: ['roster', {}] }, { method: ['messages', {}] }, { method: ['creator', {}] }])
        .findOne({
          where: { id },
          order: [[
            { model: DataBase.models.Group, as: 'group' },
            { model: DataBase.models.GroupMessage, as: 'messages' },
            'created_at', 'ASC'
          ]]
        })
      // order: [
      //   // [{ model: DataBase.models.GroupMessage, as: 'messages' }, 'created_at', 'ASC']
      // ],

      if (!group) throw ErrorAPI.badRequest('Group not found')

      return { type: 'group', chat: new TransformedGroup(group), created: false }
    }

    throw ErrorAPI.badRequest('Chat not found')
  }

  static async getChats(options: GetChatsOptions): Promise<GetChatsResponse> {
    const { userID } = options

    const dialogs = await DialogService.findDialogs({ userID, active: true })
    const groups = await GroupService.findGroups({ userID })

    const dialogChats: DialogChat[] = dialogs.map(dialog => ({ type: 'user', chat: dialog }))
    const groupChats: GroupChat[] = groups.map(group => ({ type: 'group', chat: group }))

    const chats = sortChats([...dialogChats, ...groupChats])

    return { chats }
  }

  static async searchChats(options: SearchChatsOptions): Promise<SearchChatsResponse> {
    const { value, userID } = options

    const users = await UserService.searchUsers({ userID, value })

    const inactiveDialogs = await DialogService.findDialogs({
      userID, comradeID: users.map(user => user.id), active: false
    })
    const inactiveDialogChats: DialogChat[] = inactiveDialogs.map(dialog => ({ type: 'user', chat: dialog }))

    const activeDialogs = await DialogService.findDialogs({
      userID, comradeID: users.map(user => user.id), active: true
    })
    const activeDialogChats: DialogChat[] = activeDialogs.map(dialog => ({ type: 'user', chat: dialog }))

    const groups = await GroupService.searchGroups({ userID, value })
    const groupChats: GroupChat[] = groups.map(group => ({ type: 'group', chat: group }))

    if (value.trim() === '') {
      return { chats: sortChats([...activeDialogChats, ...groupChats]), users: [] }
    }

    const dialogsComrades = [...activeDialogChats, ...inactiveDialogChats].map(dialog => dialog.chat.roster.find(user => user.id !== userID)!)
    const filteredUsers = users.filter(user => !dialogsComrades.some(item => item.id === user.id))

    const chats = sortChats([...activeDialogChats, ...inactiveDialogChats, ...groupChats])

    return { chats, users: filteredUsers }
  }
}

export default ChatService
