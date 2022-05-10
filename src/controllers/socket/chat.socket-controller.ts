import {
  SocketController,
  OnConnect,
  OnDisconnect,
  OnMessage,
  MessageBody,
  ConnectedSocket,
  SocketIO
} from 'socket-controllers'

import ChatService from '../../services/chat'
import MessageService from '../../services/message'
import { useSocketMiddleware } from '../../utils/custom-socket-middleware'
import { authSocketMiddleware } from '../../middlewares/socket/auth.socket-middleware'
import { authRolesArray } from '../../utils/constants'
import { JoinChatDTO, LeaveChatDTO, SendMessageDTO } from '../../dtos/socket/chat.dto'

const namespace = '/chat'

@SocketController(namespace)
class ChatController {
  @OnConnect()
  connection(@ConnectedSocket() socket: any) {
  }

  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: any) {
  }

  @OnMessage('chat:join')
  async joinChat(@SocketIO() io: any, @ConnectedSocket() connectedSocket: any, @MessageBody() message: JoinChatDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'chat:joined', arg: message => ({ error: { message } }) }] }
      })
    ])

    try {
      const data = await ChatService.getChat(message)

      socket.join(`chat_room=${data.chat.id}`)
      socket.emit('chat:joined', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('chat:joined', { error: { message: error.message } })
    }
  }

  @OnMessage('chat:leave')
  async leaveChat(@SocketIO() io: any, @ConnectedSocket() connectedSocket: any, @MessageBody() message: LeaveChatDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'chat:left', arg: message => ({ error: { message } }) }] }
      })
    ])

    try {
      socket.leave(`chat_room=${message.id}`)
      socket.emit('chat:left', message)
    } catch (error: any) {
      console.error(error)
      socket.emit('chat:left', { error: { message: error.message } })
    }
  }

  @OnMessage('message:send')
  async sendMessage(@SocketIO() io: any, @ConnectedSocket() connectedSocket: any, @MessageBody() message: SendMessageDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'message:sent', arg: message => ({ error: { message } }) }] }
      })
    ])
    // приходит еще date в message !!!!!!!
    try {
      const data = await MessageService.sendMessage(message)

      if (data.message.chatType === 'user') {
        const { created } = await ChatService.handleUserDialogActive({ dialogID: data.message.chatID })

        // if (created) {
        //
        // }
      }

      io.of(namespace).to(`chat_room=${data.message.chatID}`).emit('message:sent', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('message:sent', { error: { message: error.message } })
    }
  }
}

export default ChatController
