import { SocketController, OnMessage, MessageBody, ConnectedSocket } from 'socket-controllers'

import ChatService from '../services/external/chat.service'

@SocketController()
class MessengerChatRosterController {
  @OnMessage('messenger_chat_roster/get_chats')
  async get(@ConnectedSocket() socket: any, @MessageBody() message: any) {
    try {
      // const { userID } = message

      const chats = await ChatService.get(message)

      socket.emit('messenger_chat_roster/chats', chats)
    } catch (error: any) {
      socket.emit('messenger_chat_roster/chats', { error: { message: error.message } })
    }
  }
}

export default MessengerChatRosterController
