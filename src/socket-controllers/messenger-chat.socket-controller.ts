import { SocketController, OnMessage, MessageBody, ConnectedSocket, SocketIO } from 'socket-controllers'

import ChatService from '../services/external/chat.service'
import { GetChatDTO, CreateDialogDTO, CreateGroupDTO } from '../dtos/socket-controllers/messenger-chat.dto'

@SocketController()
class MessengerChatController {
  @OnMessage('messenger_chat/get_chat')
  async getChat(@ConnectedSocket() socket: any, @MessageBody() message: GetChatDTO) {
    try {
      const chat = await ChatService.getChat(message)

      socket.emit('messenger_chat/chat', chat)
    } catch (error: any) {
      console.error(error)
      socket.emit('messenger_chat/chat', { error: { message: error.message } })
    }
  }

  @OnMessage('messenger_chat/create_dialog')
  async createDialog(@SocketIO() io: any, @ConnectedSocket() socket: any, @MessageBody() message: CreateDialogDTO) {
    try {
      const dialog = await ChatService.createDialog(message)

      io.sockets.to(socket.handshake.auth.user.id).emit('messenger_chat/created_dialog', dialog)
    } catch (error: any) {
      console.error(error)
      socket.emit('messenger_chat/created_dialog', { error: { message: error.message } })
    }
  }

  @OnMessage('messenger_chat/create_group')
  async createGroup(@SocketIO() io: any, @ConnectedSocket() socket: any, @MessageBody() message: CreateGroupDTO) {
    try {
      const group = await ChatService.createGroup(message)

      io.sockets.to(socket.handshake.auth.user.id).emit('messenger_chat/created_group', group)
    } catch (error: any) {
      console.error(error)
      socket.emit('messenger_chat/created_group', { error: { message: error.message } })
    }
  }
}

export default MessengerChatController
