import { SocketController, OnConnect, OnDisconnect, OnMessage, MessageBody, ConnectedSocket } from 'socket-controllers'

import ChatService from '../../services/external/chat.service'
import { GetChatDTO } from '../../dtos/socket/chat.dto'
import { useSocketMiddleware } from '../../utils/custom-socket-middleware'
import { authSocketMiddleware } from '../../middlewares/socket/auth.socket-middleware'
import { authRolesArray } from '../../utils/constants'

@SocketController('/chat')
class ChatController {
  @OnConnect()
  connection(@ConnectedSocket() socket: any) {}

  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: any) {}

  @OnMessage('chat:get')
  async getChat(@ConnectedSocket() connectedSocket: any, @MessageBody() message: GetChatDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'chat:got_item', arg: message => ({ error: { message } }) }] },
      }),
    ])
    
    try {
      const data = await ChatService.getChat(message)

      socket.emit('chat:got_item', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('chat:got_item', { error: { message: error.message } })
    }
  }
}

export default ChatController
