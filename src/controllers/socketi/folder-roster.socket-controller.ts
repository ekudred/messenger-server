import { Socket } from 'socket.io'

import SocketController from '../../custom-socket-controllers/SocketController'
import FolderService from '../../services/external/folder.service'
import { CreateFolderDTO, GetFoldersDTO, DeleteFolderDTO, EditFolderDTO } from '../../dtos/socket/folder-roster.dto'
import { authSocketMiddleware } from '../../middlewares/socket/auth.socket-middleware'
import { authRolesArray } from '../../utils/constants'

class FolderRosterController extends SocketController {
  constructor(io: any) {
    super(io)
    super.namespace = '/folder_roster'
    super.middleware = authSocketMiddleware(authRolesArray)
    super.init([this.createFolder, this.editFolder, this.deleteFolder, this.getFolders])
  }

  public createFolder(io: any, socket: Socket) {
    socket.on('folder:create', async (message: CreateFolderDTO) => {
      try {
        const data = await FolderService.create(message)

        socket.emit('folder:created_item', data)
        // io.sockets.to(socket.handshake.auth.user.id).emit('folder:created_item', data)
      } catch (error: any) {
        console.error(error)
        socket.emit('folder:created_item', { error: { message: error.message } })
      }
    })
  }

  public editFolder(io: any, socket: Socket) {
    socket.on('folder:edit', async (message: EditFolderDTO) => {
      try {
        const data = await FolderService.edit(message)

        socket.emit('folder:edited_item', data)
        // io.sockets.to(socket.handshake.auth.user.id).emit('folder:edited_item', data)
      } catch (error: any) {
        console.error(error)
        socket.emit('folder:edited_item', { error: { message: error.message } })
      }
    })
  }

  public deleteFolder(io: any, socket: Socket) {
    socket.on('folder:delete', async (message: DeleteFolderDTO) => {
      try {
        const data = await FolderService.delete(message)

        socket.emit('folder:deleted_item', data)
        // io.sockets.to(socket.handshake.auth.user.id).emit('folder:deleted_item', data)
      } catch (error: any) {
        console.error(error)
        socket.emit('folder:deleted_item', { error: { message: error.message } })
      }
    })
  }

  public getFolders(io: any, socket: Socket) {
    socket.on('folders:get', async (message: GetFoldersDTO) => {
      try {
        const data = await FolderService.get(message)

        socket.emit('folders:got_list', data)
      } catch (error: any) {
        console.error(error)
        socket.emit('folders:got_list', { error: { message: error.message } })
      }
    })
  }
}

export default FolderRosterController
