import { Op } from 'sequelize'

import DataBase from '../../database'
import ErrorAPI from '../../exceptions/ErrorAPI'
import {
  SendMessageOptions,
  SendMessageResponse,
  HandleNewMessageOptions,
  HandleNewMessageResponse,
  CreateDialogMessageOptions,
  CreateDialogMessageResponse,
  CreateGroupMessageOptions,
  CreateGroupMessageResponse,
  ViewMessagesOptions,
  ViewMessagesResponse
} from './types'
import Message from '../../helpers/message'
import User from '../../helpers/user'
import Dialog from '../../helpers/dialog'
import Group from '../../helpers/group'
import { DialogChat, GroupChat } from '../chat/types'

class MessageService {
  static async sendMessage(options: SendMessageOptions): Promise<SendMessageResponse> {
    const { messageID, userID, chatID, chatType, text } = options

    switch (chatType) {
      case 'user':
        return this.createDialogMessage({ messageID, userID, dialogID: chatID, text })
      case 'group':
        return this.createGroupMessage({ messageID, userID, groupID: chatID, text })
    }
  }

  static async handleNewMessage(options: HandleNewMessageOptions): Promise<HandleNewMessageResponse> {
    const { message } = options
    const { chatType, chatID } = message

    if (chatType === 'user') {
      const dialog = await DataBase.models.Dialog
        .scope([
          { method: ['roster', {}] },
          { method: ['lastMessage', {}] },
          { method: ['unreadMessages', {}] }
        ])
        .findOne({ where: { id: chatID } })

      dialog.last_message_id = message.id
      await dialog.save()

      const chat: DialogChat = { type: 'user', chat: new Dialog(dialog) }
      const roster: User[] = dialog.roster.map((item: any) => new User(item.user))

      return { message, roster, chat }
    }

    if (chatType === 'group') {
      const group = await DataBase.models.Group
        .scope([
          { method: ['roster', {}] },
          { method: ['lastMessage', {}] },
          { method: ['creator', {}] },
          { method: ['unreadMessages', {}] }
        ])
        .findOne({ where: { id: chatID } })
      group.last_message_id = message.id
      await group.save()

      const chat: GroupChat = { type: 'group', chat: new Group(group) }
      const roster: User[] = group.roster.map((item: any) => new User(item.user))

      return { message, roster, chat }
    }

    throw ErrorAPI.badRequest('Chat not found')
  }

  static async viewMessages(options: ViewMessagesOptions): Promise<ViewMessagesResponse> {
    const { chatType, chatID, viewMessages, roster, userID } = options

    if (chatType === 'user') {
      const dialogMessagesIDs = viewMessages.map(message => message.id)

      await DataBase.models.DialogMessageUnread
        .scope([{ method: ['rosterItem', { whereUser: { id: userID } }] }])
        .destroy({ where: { message_id: dialogMessagesIDs } })

      const unreadMessages = await DataBase.models.DialogMessageUnread
        .scope([{ method: ['rosterItem', { whereUser: { id: userID } }] }])
        .count({ where: { dialog_id: chatID } })

      return { userID, chatType, chatID, roster, readMessages: viewMessages, unreadMessages }
    }

    if (chatType === 'group') {
      const groupMessagesIDs = viewMessages.map(message => message.id)

      await DataBase.models.GroupMessageUnread
        .scope([{ method: ['rosterItem', { whereUser: { id: userID } }] }])
        .destroy({ where: { message_id: groupMessagesIDs } })

      const unreadMessages = await DataBase.models.GroupMessageUnread
        .scope([{ method: ['rosterItem', { whereUser: { id: userID } }] }])
        .count({ where: { group_id: chatID } })

      return { userID, chatType, chatID, roster, readMessages: viewMessages, unreadMessages }
    }

    return { userID, chatType, chatID, roster, readMessages: [], unreadMessages: 0 }
  }

  static async createDialogMessage(options: CreateDialogMessageOptions): Promise<CreateDialogMessageResponse> {
    const { messageID, userID, dialogID, text } = options

    await DataBase.models.DialogMessage.create({ id: messageID, author_id: userID, dialog_id: dialogID, text })

    const roster = await DataBase.models.DialogRoster.findAll({ where: { dialog_id: dialogID } })
    const filteredRoster = roster.filter((item: any) => item.user_id !== userID)!

    const bulkOptionsCreateDialogMessageUnread = filteredRoster.map((item: any) => ({
      message_id: messageID, roster_item_id: item.id, dialog_id: dialogID
    }))
    await DataBase.models.DialogMessageUnread.bulkCreate(bulkOptionsCreateDialogMessageUnread)

    const lastMessage = await DataBase.models.DialogLastMessage.findOne({ where: { dialog_id: dialogID } })
    if (lastMessage) {
      await DataBase.models.DialogLastMessage.update({ message_id: messageID }, { where: { dialog_id: dialogID } })
    } else {
      await DataBase.models.DialogLastMessage.create({ dialog_id: dialogID, message_id: messageID })
    }

    const dialogMessage = await DataBase.models.DialogMessage
      .scope([
        { method: ['author', {}] },
        { method: ['dialog', {}] },
        { method: ['unread', {}] }
      ])
      .findOne({ where: { id: messageID } })

    return { message: new Message({ chatType: 'user', chatID: dialogID, model: dialogMessage }) }
  }

  static async createGroupMessage(options: CreateGroupMessageOptions): Promise<CreateGroupMessageResponse> {
    const { messageID, userID, groupID, text } = options

    await DataBase.models.GroupMessage.create({ id: messageID, author_id: userID, group_id: groupID, text })

    const roster = await DataBase.models.GroupRoster.findAll({ where: { group_id: groupID } })
    const filteredRoster = roster.filter((item: any) => item.user_id !== userID)!

    const bulkOptionsCreateGroupMessageUnread = filteredRoster.map((item: any) => ({
      message_id: messageID, roster_item_id: item.id, group_id: groupID
    }))
    await DataBase.models.GroupMessageUnread.bulkCreate(bulkOptionsCreateGroupMessageUnread)

    const lastMessage = await DataBase.models.GroupLastMessage.findOne({ where: { group_id: groupID } })
    if (lastMessage) {
      await DataBase.models.GroupLastMessage.update({ message_id: messageID }, { where: { group_id: groupID } })
    } else {
      await DataBase.models.GroupLastMessage.create({ group_id: groupID, message_id: messageID })
    }

    const groupMessage = await DataBase.models.GroupMessage
      .scope([
        { method: ['author', {}] },
        { method: ['group', {}] },
        { method: ['unread', {}] }
      ])
      .findOne({ where: { id: messageID } })

    return { message: new Message({ chatType: 'group', chatID: groupID, model: groupMessage }) }
  }
}

export default MessageService
