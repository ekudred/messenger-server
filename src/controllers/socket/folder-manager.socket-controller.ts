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
import {
  CreateFolderDTO,
  GetFoldersDTO,
  DeleteFolderDTO,
  EditFolderDTO,
  SearchFolderChatsDTO
} from '../../dtos/socket/folder-manager.dto'
import { useSocketMiddleware } from '../../utils/custom-socket-middleware'
import { authSocketMiddleware } from '../../middlewares/socket/auth.socket-middleware'
import { authRolesArray } from '../../utils/constants'

const namespace = '/folder_manager'

@SocketController(namespace)
class FolderManagerController {
  @OnConnect()
  connection(@ConnectedSocket() connectedSocket: any) {
  }

  @OnDisconnect()
  disconnect(@ConnectedSocket() connectedSocket: any) {
  }

  @OnMessage('folder:create')
  async createFolder(@SocketIO() io: any, @ConnectedSocket() connectedSocket: any, @MessageBody() body: CreateFolderDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'folder:created', arg: message => ({ error: { message } }) }] }
      })
    ])

    try {
      const data = await FolderService.createFolder(body)

      io.of(namespace).to(`user_room=${body.userID}`).emit('folder:created', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('folder:created', { error: { message: error.message } })
    }
  }

  @OnMessage('folder:edit')
  async editFolder(@SocketIO() io: any, @ConnectedSocket() connectedSocket: any, @MessageBody() body: EditFolderDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'folder:edited', arg: message => ({ error: { message } }) }] }
      })
    ])

    try {
      const data = await FolderService.editFolder(body)

      io.of(namespace).to(`user_room=${socket.handshake.auth.user.id}`).emit('folder:edited', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('folder:edited', { error: { message: error.message, extra: { folderID: body.folderID } } })
    }
  }

  @OnMessage('folder:delete')
  async deleteFolder(@SocketIO() io: any, @ConnectedSocket() connectedSocket: any, @MessageBody() body: DeleteFolderDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'folder:deleted', arg: message => ({ error: { message } }) }] }
      })
    ])

    try {
      const data = await FolderService.deleteFolder(body)

      io.of(namespace).to(`user_room=${socket.handshake.auth.user.id}`).emit('folder:deleted', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('folder:deleted', { error: { message: error.message, extra: { folderID: body.folderID } } })
    }
  }

  @OnMessage('folders:get')
  async getFolders(@ConnectedSocket() connectedSocket: any, @MessageBody() body: GetFoldersDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'folder:got', arg: message => ({ error: { message } }) }] }
      })
    ])

    try {
      const folders = await FolderService.findFolders(body)

      socket.join(`folder_manager_room=${body.userID}`)
      socket.emit('folders:got', { userID: body.userID, folders })
    } catch (error: any) {
      console.error(error)
      socket.emit('folders:got', { error: { message: error.message } })
    }
  }

  @OnMessage('chats:search')
  async searchFolderChats(@ConnectedSocket() connectedSocket: any, @MessageBody() body: SearchFolderChatsDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'chats:search', arg: message => ({ error: { message } }) }] }
      })
    ])

    try {
      const data = await FolderService.searchFolderChats(body)

      socket.emit('chats:searched', { userID: body.userID, folderID: body.folderID, ...data })
    } catch (error: any) {
      console.error(error)
      socket.emit('chats:searched', { error: { message: error.message, extra: { folderID: body.folderID } } })
    }
  }
}

export default FolderManagerController
