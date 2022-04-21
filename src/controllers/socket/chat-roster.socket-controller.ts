import { SocketController, OnConnect, OnDisconnect, OnMessage, MessageBody, ConnectedSocket, SocketIO } from 'socket-controllers'

import ChatService from '../../services/external/chat.service'
import { GetChatsDTO, GetDialogsDTO, SearchChatsDTO, CreateDialogDTO, CreateGroupDTO } from '../../dtos/socket/chat-roster.dto'
import { useSocketMiddleware } from '../../utils/custom-socket-middleware'
import { authSocketMiddleware } from '../../middlewares/socket/auth.socket-middleware'
import { authRolesArray } from '../../utils/constants'

@SocketController('/chat_roster')
class ChatRosterController {
  @OnConnect()
  connection(@ConnectedSocket() socket: any) {}

  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: any) {}

  @OnMessage('chats:get')
  async getChats(@SocketIO() io: any, @ConnectedSocket() connectedSocket: any, @MessageBody() message: GetChatsDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'chats:got_list', arg: message => ({ error: { message } }) }] },
      }),
    ])

    try {
      const data = await ChatService.getChats(message)
      // const { dialogs, groups } = data

      // dialogs.forEach((dialog: any) => socket.join(dialog.id))

      socket.emit('chats:got_list', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('chats:got_list', { error: { message: error.message } })
    }
  }

  @OnMessage('chats:search')
  async searchChats(@ConnectedSocket() connectedSocket: any, @MessageBody() message: SearchChatsDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'chats:searched_list', arg: message => ({ error: { message } }) }] },
      }),
    ])

    try {
      const data = await ChatService.searchChats(message)

      socket.emit('chats:searched_list', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('chats:searched_list', { error: { message: error.message } })
    }
  }

  @OnMessage('dialogs:get')
  async getDialogs(@ConnectedSocket() connectedSocket: any, @MessageBody() message: GetDialogsDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'dialogs:got_list', arg: message => ({ error: { message } }) }] },
      }),
    ])

    try {
      const data = await ChatService.getDialogs(message)

      socket.emit('dialogs:got_list', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('dialogs:got_list', { error: { message: error.message } })
    }
  }

  @OnMessage('dialog:create')
  async createDialog(@SocketIO() io: any, @ConnectedSocket() connectedSocket: any, @MessageBody() message: CreateDialogDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'dialog:created_item', arg: message => ({ error: { message } }) }] },
      }),
    ])

    try {
      const data = await ChatService.createDialog(message)

      socket.emit('dialog:created_item', data)
      // io.sockets.to(socket.handshake.auth.user.id).emit('dialog:created_item', data)
      // io.sockets.to(message.companionID).emit('created_dialog', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('dialog:created_item', { error: { message: error.message } })
    }
  }

  @OnMessage('group:create')
  async createGroup(@SocketIO() io: any, @ConnectedSocket() connectedSocket: any, @MessageBody() message: CreateGroupDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'group:created_item', arg: message => ({ error: { message } }) }] },
      }),
    ])

    try {
      const data = await ChatService.createGroup(message)

      socket.emit('group:created_item', data)
      // io.sockets.to(socket.handshake.auth.user.id).emit('group:created_item', data)
      // message.roster.forEach(item => {
      //   io.sockets.to(item.userID).emit('created_group', data)
      // })
    } catch (error: any) {
      console.error(error)
      socket.emit('group:created_item', { error: { message: error.message } })
    }
  }
}

export default ChatRosterController
