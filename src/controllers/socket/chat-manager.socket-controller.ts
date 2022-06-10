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
import DialogService from '../../services/dialog'
import GroupService from '../../services/group'
import {
  GetChatsDTO,
  GetDialogsDTO,
  SearchChatsDTO,
  SearchDialogsDTO,
  CreateGroupDTO
} from '../../dtos/socket/chat-manager.dto'
import { useSocketMiddleware } from '../../utils/custom-socket-middleware'
import { authSocketMiddleware } from '../../middlewares/socket/auth.socket-middleware'
import { authRolesArray } from '../../utils/constants'

const namespace = '/chat_manager'

@SocketController(namespace)
class ChatManagerController {
  @OnConnect()
  connection(@ConnectedSocket() socket: any) {
  }

  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: any) {
  }

  @OnMessage('chats:get')
  async getChats(@ConnectedSocket() connectedSocket: any, @MessageBody() body: GetChatsDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'chats:got', arg: message => ({ error: { message } }) }] }
      })
    ])

    try {
      const { chats } = await ChatService.getChats(body)

      const data = { userID: body.userID, chats }

      socket.join(`chat_manager_room=${body.userID}`)
      socket.emit('chats:got', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('chats:got', { error: { message: error.message } })
    }
  }

  @OnMessage('chats:search')
  async searchChats(@ConnectedSocket() connectedSocket: any, @MessageBody() body: SearchChatsDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'chats:searched', arg: message => ({ error: { message } }) }] }
      })
    ])

    try {
      const { users, chats } = await ChatService.searchChats(body)

      const data = { userID: body.userID, users, chats }

      socket.emit('chats:searched', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('chats:searched', { error: { message: error.message } })
    }
  }

  @OnMessage('dialogs:search')
  async searchDialogs(@ConnectedSocket() connectedSocket: any, @MessageBody() body: SearchDialogsDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'dialogs:searched', arg: message => ({ error: { message } }) }] }
      })
    ])

    try {
      const dialogs = await DialogService.searchDialogs(body)

      const data = { userID: body.userID, dialogs }

      socket.emit('dialogs:searched', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('dialogs:searched', { error: { message: error.message } })
    }
  }

  @OnMessage('dialogs:get')
  async getDialogs(@ConnectedSocket() connectedSocket: any, @MessageBody() body: GetDialogsDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'dialogs:got', arg: message => ({ error: { message } }) }] }
      })
    ])

    try {
      const dialogs = await DialogService.findDialogs({ ...body, active: true })

      const data = { userID: body.userID, dialogs }

      socket.emit('dialogs:got', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('dialogs:got', { error: { message: error.message } })
    }
  }

  @OnMessage('group:create')
  async createGroup(@SocketIO() io: any, @ConnectedSocket() connectedSocket: any, @MessageBody() body: CreateGroupDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'group:created', arg: message => ({ error: { message } }) }] }
      })
    ])

    try {
      const group = await GroupService.createGroup(body)

      const data = { userID: body.creatorID, group }

      io.of(namespace).to(`user_room=${body.creatorID}`).emit('group:created', data)
      body.roster.forEach(user => io.of(namespace).to(`user_room=${user.userID}`).emit('group:created', data))
    } catch (error: any) {
      console.error(error)
      socket.emit('group:created', { error: { message: error.message } })
    }
  }
}

export default ChatManagerController
