import { SocketController, OnConnect, OnDisconnect, OnMessage, MessageBody, ConnectedSocket, SocketIO } from 'socket-controllers'

import FolderService from '../../services/external/folder.service'
import { CreateFolderDTO, GetFoldersDTO, DeleteFolderDTO, EditFolderDTO } from '../../dtos/socket/folder-roster.dto'
import { useSocketMiddleware } from '../../utils/custom-socket-middleware'
import { authSocketMiddleware } from '../../middlewares/socket/auth.socket-middleware'
import { authRolesArray } from '../../utils/constants'

@SocketController('/folder_roster')
class FolderRosterController {
  @OnConnect()
  connection(@ConnectedSocket() connectedSocket: any) {}

  @OnDisconnect()
  disconnect(@ConnectedSocket() connectedSocket: any) {}

  @OnMessage('folder:create')
  async create(@SocketIO() io: any, @ConnectedSocket() connectedSocket: any, @MessageBody() message: CreateFolderDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'folder:created_item', arg: message => ({ error: { message } }) }] },
      }),
    ])

    try {
      const data = await FolderService.create(message)

      socket.emit('folder:created_item', data)
      // io.sockets.to(socket.handshake.auth.user.id).emit('folder:created_item', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('folder:created_item', { error: { message: error.message } })
    }
  }

  @OnMessage('folder:edit')
  async edit(@SocketIO() io: any, @ConnectedSocket() connectedSocket: any, @MessageBody() message: EditFolderDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'folder:edited_item', arg: message => ({ error: { message } }) }] },
      }),
    ])

    try {
      const data = await FolderService.edit(message)

      socket.emit('folder:edited_item', data)
      // io.sockets.to(socket.handshake.auth.user.id).emit('folder:edited_item', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('folder:edited_item', { error: { message: error.message } })
    }
  }

  @OnMessage('folder:delete')
  async delete(@SocketIO() io: any, @ConnectedSocket() connectedSocket: any, @MessageBody() message: DeleteFolderDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'folder:deleted_item', arg: message => ({ error: { message } }) }] },
      }),
    ])

    try {
      const data = await FolderService.delete(message)

      socket.emit('folder:deleted_item', data)
      // io.sockets.to(socket.handshake.auth.user.id).emit('folder:deleted_item', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('folder:deleted_item', { error: { message: error.message } })
    }
  }

  @OnMessage('folders:get')
  async get(@ConnectedSocket() connectedSocket: any, @MessageBody() message: GetFoldersDTO) {
    const socket = useSocketMiddleware(connectedSocket, [
      authSocketMiddleware({
        permittedRoles: authRolesArray,
        emitAtError: { emits: [{ event: 'folder:got_list', arg: message => ({ error: { message } }) }] },
      }),
    ])

    try {
      const data = await FolderService.get(message)

      socket.emit('folders:got_list', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('folders:got_list', { error: { message: error.message } })
    }
  }
}

export default FolderRosterController
