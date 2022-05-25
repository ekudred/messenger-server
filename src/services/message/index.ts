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
  CreateGroupMessageResponse
} from './types'
import Message from '../../helpers/message'
import User from '../../helpers/user'
import Dialog from '../../helpers/dialog'
import Group from '../../helpers/group'
import { DialogChat, GroupChat } from '../chat/types'

class MessageService {
  public static async sendMessage(options: SendMessageOptions): Promise<SendMessageResponse> {
    const { messageID, userID, chatID, chatType, text } = options

    switch (chatType) {
      case 'user':
        return this.createDialogMessage({ messageID, userID, dialogID: chatID, text })
      case 'group':
        return this.createGroupMessage({ messageID, userID, groupID: chatID, text })
    }
  }

  public static async handleNewMessage(options: HandleNewMessageOptions): Promise<HandleNewMessageResponse> {
    const { message } = options
    const { chatType, chatID } = message

    if (chatType === 'user') {
      const dialog = await DataBase.models.Dialog.scope(['roster', 'messages']).findOne({ where: { id: chatID } })
      dialog.updated_messages_at = new Date()
      await dialog.save()

      const chat: DialogChat = { type: 'user', chat: new Dialog(dialog) }
      const roster: User[] = dialog.roster.map((item: any) => new User(item.user))

      return { message, roster, chat }
    }

    if (chatType === 'group') {
      const group = await DataBase.models.Group.scope(['roster', 'messages', 'creator']).findOne({ where: { id: chatID } })
      group.updated_messages_at = new Date()
      await group.save()

      const chat: GroupChat = { type: 'group', chat: new Group(group) }
      const roster: User[] = group.roster.map((item: any) => new User(item.user))

      return { message, roster, chat }
    }

    throw ErrorAPI.badRequest('Chat not found')
  }

  public static async createDialogMessage(options: CreateDialogMessageOptions): Promise<CreateDialogMessageResponse> {
    const { messageID, userID, dialogID, text } = options

    await DataBase.models.DialogMessage.create({ id: messageID, user_id: userID, dialog_id: dialogID, text })

    const roster = await DataBase.models.DialogRoster.findAll({ where: { dialog_id: dialogID } })
    const filteredRoster = roster.filter((item: any) => item.user_id !== userID)!

    const bulkOptionsCreateDialogMessageUnread = filteredRoster.map((item: any) => ({
      message_id: messageID, roster_item_id: item.id
    }))
    await DataBase.models.DialogMessageUnread.bulkCreate(bulkOptionsCreateDialogMessageUnread)

    const dialogMessage = await DataBase.models.DialogMessage.scope(['user', 'dialog', 'unread']).findOne({ where: { id: messageID } })

    return { message: new Message({ chatType: 'user', chatID: dialogID, model: dialogMessage }) }
  }

  public static async createGroupMessage(options: CreateGroupMessageOptions): Promise<CreateGroupMessageResponse> {
    const { messageID, userID, groupID, text } = options

    await DataBase.models.GroupMessage.create({ id: messageID, user_id: userID, group_id: groupID, text })

    const roster = await DataBase.models.GroupRoster.findAll({ where: { group_id: groupID } })
    const filteredRoster = roster.filter((item: any) => item.user_id !== userID)!

    const bulkOptionsCreateGroupMessageUnread = filteredRoster.map((item: any) => ({
      message_id: messageID, roster_item_id: item.id
    }))
    await DataBase.models.GroupMessageUnread.bulkCreate(bulkOptionsCreateGroupMessageUnread)

    const groupMessage = await DataBase.models.GroupMessage.scope(['user', 'group', 'unread']).findOne({ where: { id: messageID } })

    return { message: new Message({ chatType: 'group', chatID: groupID, model: groupMessage }) }
  }
}

export default MessageService
