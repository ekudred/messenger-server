import { SocketController, OnMessage, MessageBody, ConnectedSocket, SocketIO } from 'socket-controllers'

import ChatService from '../services/external/chat.service'
import { GetChatsDTO, GetDialogsDTO, SearchChatsDTO } from '../dtos/socket-controllers/messenger-chat-roster.dto'

@SocketController()
class MessengerChatRosterController {
  @OnMessage('messenger_chat_roster/get_chats')
  async getChats(@SocketIO() io: any, @ConnectedSocket() socket: any, @MessageBody() message: GetChatsDTO) {
    try {
      const chats = await ChatService.getChats(message)
      // const { dialogs, groups } = chats

      // dialogs.forEach((dialog: any) => socket.join(dialog.id))

      socket.emit('messenger_chat_roster/chats', chats)
    } catch (error: any) {
      console.error(error)
      socket.emit('messenger_chat_roster/chats', { error: { message: error.message } })
    }
  }

  @OnMessage('messenger_chat_roster/get_dialogs')
  async getDialogs(@ConnectedSocket() socket: any, @MessageBody() message: GetDialogsDTO) {
    try {
      const dialogs = await ChatService.getDialogs(message)

      socket.emit('messenger_chat_roster/dialogs', dialogs)
    } catch (error: any) {
      console.error(error)
      socket.emit('messenger_chat_roster/dialogs', { error: { message: error.message } })
    }
  }

  @OnMessage('messenger_chat_roster/search_chats')
  async searchChats(@ConnectedSocket() socket: any, @MessageBody() message: SearchChatsDTO) {
    try {
      const chats = await ChatService.searchChats(message)

      socket.emit('messenger_chat_roster/found_chats', chats)
    } catch (error: any) {
      console.error(error)
      socket.emit('messenger_chat_roster/found_chats', { error: { message: error.message } })
    }
  }
}

export default MessengerChatRosterController
