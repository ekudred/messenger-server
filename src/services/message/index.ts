import DataBase from '../../database'
import ChatService from '../chat'
import { SendMessageOptions, SendMessageResponse } from './types'
import Message from '../../helpers/message'

class MessageService {
  public static async sendMessage(options: SendMessageOptions): Promise<SendMessageResponse> {
    const { messageID, userID, chatType, chatID, text } = options

    switch (chatType) {
      case 'dialog':
        const dialogMessage = await DataBase.models.DialogMessage.create({
          id: messageID,
          user_id: userID,
          dialog_id: chatID,
          text
        })
        return { message: new Message('dialog', dialogMessage) }
      case 'user':
        const { dialog } = await ChatService.createDialog({ userID, companionID: chatID })
        const userMessage = await DataBase.models.DialogMessage.create({
          id: messageID,
          user_id: userID,
          dialog_id: dialog.id,
          text
        })
        return { message: new Message('dialog', userMessage) }
      case 'group':
        const groupMessage = await DataBase.models.GroupMessage.create({
          id: messageID,
          user_id: userID,
          group_id: chatID,
          text
        })
        return { message: new Message('group', groupMessage) }
    }
  }
}

export default MessageService
