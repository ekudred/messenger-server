import { Socket } from 'socket.io'

import SocketController from '../../custom-socket-controllers/SocketController'
import ChatService from '../../services/external/chat.service'
import { GetChatsDTO, GetDialogsDTO, SearchChatsDTO, CreateDialogDTO, CreateGroupDTO } from '../../dtos/socket/chat-roster.dto'
import { authSocketMiddleware } from '../../middlewares/socket/auth.socket-middleware'
import { authRolesArray } from '../../utils/constants'

class ChatRosterController extends SocketController {
  constructor(io: any) {
    super(io)
    super.namespace = '/chat_roster'
    super.middleware = authSocketMiddleware(authRolesArray)
    super.init([this.getChats, this.searchChats, this.getDialogs, this.createDialog, this.createGroup])
  }

  public getChats(io: any, socket: Socket) {
    socket.on('chats:get', async (message: GetChatsDTO) => {
      try {
        const data = await ChatService.getChats(message)
        // const { dialogs, groups } = data

        // dialogs.forEach((dialog: any) => socket.join(dialog.id))

        socket.emit('chats:got_list', data)
      } catch (error: any) {
        console.error(error)
        socket.emit('chats:got_list', { error: { message: error.message } })
      }
    })
  }

  public searchChats(io: any, socket: Socket) {
    socket.on('chats:search', async (message: SearchChatsDTO) => {
      try {
        const data = await ChatService.searchChats(message)

        socket.emit('chats:searched_list', data)
      } catch (error: any) {
        console.error(error)
        socket.emit('chats:searched_list', { error: { message: error.message } })
      }
    })
  }

  public getDialogs(io: any, socket: Socket) {
    socket.on('dialogs:get', async (message: GetDialogsDTO) => {
      try {
        const data = await ChatService.getDialogs(message)

        socket.emit('dialogs:got_list', data)
      } catch (error: any) {
        console.error(error)
        socket.emit('dialogs:got_list', { error: { message: error.message } })
      }
    })
  }

  public createDialog(io: any, socket: any) {
    socket.on('dialog:create', async (message: CreateDialogDTO) => {
      try {
        const data = await ChatService.createDialog(message)

        socket.emit('dialog:created_item', data)
        // io.sockets.to(socket.handshake.auth.user.id).emit('dialog:created_item', data)
        // io.sockets.to(message.companionID).emit('created_dialog', data)
      } catch (error: any) {
        console.error(error)
        socket.emit('dialog:created_item', { error: { message: error.message } })
      }
    })
  }

  public createGroup(io: any, socket: any) {
    socket.on('group:create', async (message: CreateGroupDTO) => {
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
    })
  }
}

export default ChatRosterController
