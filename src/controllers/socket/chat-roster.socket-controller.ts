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
import {
  GetChatsDTO,
  GetDialogsDTO,
  SearchChatsDTO,
  CreateGroupDTO
} from '../../dtos/socket/chat-roster.dto'
import { useSocketMiddleware } from '../../utils/custom-socket-middleware'
import { authSocketMiddleware } from '../../middlewares/socket/auth.socket-middleware'
import { authRolesArray } from '../../utils/constants'

const namespace = '/chat_roster'

@SocketController(namespace)
class ChatRosterController {
  @OnConnect()
  connection(@ConnectedSocket() socket: any) {
  }

  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: any) {
  }

  @OnMessage('chats:get')
  async getChats(@ConnectedSocket() connectedSocket: any, @MessageBody() message: GetChatsDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'chats:got', arg: message => ({ error: { message } }) }] }
      })
    ])

    try {
      const data = await ChatService.getChats(message)
      // const { dialogs, groups } = data

      // dialogs.forEach((dialog: any) => socket.join(dialog.id))

      socket.emit('chats:got', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('chats:got', { error: { message: error.message } })
    }
  }

  @OnMessage('chats:search')
  async searchChats(@ConnectedSocket() connectedSocket: any, @MessageBody() message: SearchChatsDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'chats:searched', arg: message => ({ error: { message } }) }] }
      })
    ])

    try {
      const data = await ChatService.searchChats(message)

      socket.emit('chats:searched', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('chats:searched', { error: { message: error.message } })
    }
  }

  @OnMessage('dialogs:get')
  async getDialogs(@ConnectedSocket() connectedSocket: any, @MessageBody() message: GetDialogsDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'dialogs:got', arg: message => ({ error: { message } }) }] }
      })
    ])

    try {
      const data = await ChatService.getDialogs(message)

      socket.emit('dialogs:got', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('dialogs:got', { error: { message: error.message } })
    }
  }

  @OnMessage('group:create')
  async createGroup(@SocketIO() io: any, @ConnectedSocket() connectedSocket: any, @MessageBody() message: CreateGroupDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'group:created', arg: message => ({ error: { message } }) }] }
      })
    ])

    try {
      const data = await ChatService.createGroup(message)

      io.of(namespace).to(`user_room=${message.creatorID}`).emit('group:created', data)
      message.roster.forEach(user => io.of(namespace).to(`user_room=${user.userID}`).emit('group:created', data))
    } catch (error: any) {
      console.error(error)
      socket.emit('group:created', { error: { message: error.message } })
    }
  }
}

export default ChatRosterController
