import {
  SocketController,
  OnConnect,
  OnDisconnect,
  OnMessage,
  MessageBody,
  ConnectedSocket,
  SocketIO
} from 'socket-controllers'

import FolderService from '../../services/folder'
import ChatService from '../../services/chat'
import {
  CreateFolderDTO,
  GetFoldersDTO,
  DeleteFolderDTO,
  EditFolderDTO,
  GetChatsDTO
} from '../../dtos/socket/folder-roster.dto'
import { useSocketMiddleware } from '../../utils/custom-socket-middleware'
import { authSocketMiddleware } from '../../middlewares/socket/auth.socket-middleware'
import { authRolesArray } from '../../utils/constants'

const namespace = '/folder_roster'

@SocketController(namespace)
class FolderRosterController {
  @OnConnect()
  connection(@ConnectedSocket() connectedSocket: any) {
  }

  @OnDisconnect()
  disconnect(@ConnectedSocket() connectedSocket: any) {
  }

  @OnMessage('folder:create')
  async createFolder(@SocketIO() io: any, @ConnectedSocket() connectedSocket: any, @MessageBody() message: CreateFolderDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'folder:created', arg: message => ({ error: { message } }) }] }
      })
    ])

    try {
      const data = await FolderService.createFolder(message)

      io.of(namespace).to(`user_room=${message.userID}`).emit('folder:created', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('folder:created', { error: { message: error.message } })
    }
  }

  @OnMessage('folder:edit')
  async editFolder(@SocketIO() io: any, @ConnectedSocket() connectedSocket: any, @MessageBody() message: EditFolderDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'folder:edited', arg: message => ({ error: { message } }) }] }
      })
    ])

    try {
      const data = await FolderService.editFolder(message)

      io.of(namespace).to(`user_room=${socket.handshake.auth.user.id}`).emit('folder:edited', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('folder:edited', { error: { message: error.message } })
    }
  }

  @OnMessage('folder:delete')
  async deleteFolder(@SocketIO() io: any, @ConnectedSocket() connectedSocket: any, @MessageBody() message: DeleteFolderDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'folder:deleted', arg: message => ({ error: { message } }) }] }
      })
    ])

    try {
      const data = await FolderService.deleteFolder(message)

      io.of(namespace).to(`user_room=${socket.handshake.auth.user.id}`).emit('folder:deleted', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('folder:deleted', { error: { message: error.message } })
    }
  }

  @OnMessage('folders:get')
  async getFolders(@ConnectedSocket() connectedSocket: any, @MessageBody() message: GetFoldersDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'folder:got', arg: message => ({ error: { message } }) }] }
      })
    ])

    try {
      const data = await FolderService.getFolders(message)

      socket.emit('folders:got', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('folders:got', { error: { message: error.message } })
    }
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

      socket.emit('chats:got', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('chats:got', { error: { message: error.message } })
    }
  }
}

export default FolderRosterController
