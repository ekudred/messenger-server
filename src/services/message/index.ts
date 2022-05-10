import DataBase from '../../database'
import { SendMessageOptions, SendMessageResponse } from './types'
import Message from '../../helpers/message'

class MessageService {
  public static async sendMessage(options: SendMessageOptions): Promise<SendMessageResponse> {
    const { messageID, userID, chatID, chatType, text } = options

    switch (chatType) {
      case 'user':
        const dialogMessage = await DataBase.models.DialogMessage.create({
          id: messageID, user_id: userID, dialog_id: chatID, text
        })
        return { message: new Message({ chatType: 'user', chatID, model: dialogMessage }) }
      case 'group':
        const groupMessage = await DataBase.models.GroupMessage.create({
          id: messageID, user_id: userID, group_id: chatID, text
        })
        return { message: new Message({ chatType: 'group', chatID, model: groupMessage }) }
    }
  }
}

export default MessageService
