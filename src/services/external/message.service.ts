import DataBase from '../../database'
import { SendMessageDTO } from '../../dtos/socket/chat.dto'
import { MessageDTO } from '../../dtos/common/message.dto'

interface SendMessageOptions extends SendMessageDTO {
}

class MessageService {
  public static async send(options: SendMessageOptions) {
    const { messageID, userID, chatType, chatID, text } = options

    switch (chatType) {
      case 'dialog':
        const dialogMessage = await DataBase.models.DialogMessage.create({
          id: messageID,
          user_id: userID,
          dialog_id: chatID,
          text
        })
        return { message: new MessageDTO('dialog', dialogMessage) }
      case 'group':
        const groupMessage = await DataBase.models.GroupMessage.create({
          id: messageID,
          user_id: userID,
          group_id: chatID,
          text
        })
        return { message: new MessageDTO('group', groupMessage) }
    }
  }
}

export default MessageService
