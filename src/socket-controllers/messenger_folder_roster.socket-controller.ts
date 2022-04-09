import { SocketController, OnMessage, MessageBody, ConnectedSocket, SocketIO } from 'socket-controllers'

import FolderService from '../services/external/folder.service'
import { CreateFolderDTO, GetFoldersDTO, DeleteFolderDTO, EditFolderDTO } from '../dtos/socket-controllers/messenger-folder-roster.dto'

@SocketController()
class MessengerFolderRosterController {
  @OnMessage('messenger_folder_roster/create_folder')
  async create(@SocketIO() io: any, @ConnectedSocket() socket: any, @MessageBody() message: CreateFolderDTO) {
    try {
      const data = await FolderService.create(message)

      io.sockets.to(socket.handshake.auth.user.id).emit('messenger_folder_roster/created_folder', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('messenger_folder_roster/created_folder', { error: { message: error.message } })
    }
  }

  @OnMessage('messenger_folder_roster/get_folders')
  async get(@ConnectedSocket() socket: any, @MessageBody() message: GetFoldersDTO) {
    try {
      const data = await FolderService.get(message)

      socket.emit('messenger_folder_roster/folders', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('messenger_folder_roster/folders', { error: { message: error.message } })
    }
  }

  @OnMessage('messenger_folder_roster/edit_folder')
  async edit(@SocketIO() io: any, @ConnectedSocket() socket: any, @MessageBody() message: EditFolderDTO) {
    try {
      const data = await FolderService.edit(message)

      io.sockets.to(socket.handshake.auth.user.id).emit('messenger_folder_roster/edited_folder', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('messenger_folder_roster/edited_folder', { error: { message: error.message } })
    }
  }

  @OnMessage('messenger_folder_roster/delete_folder')
  async delete(@SocketIO() io: any, @ConnectedSocket() socket: any, @MessageBody() message: DeleteFolderDTO) {
    try {
      const data = await FolderService.delete(message)

      io.sockets.to(socket.handshake.auth.user.id).emit('messenger_folder_roster/deleted_folder', data)
    } catch (error: any) {
      console.error(error)
      socket.emit('messenger_folder_roster/deleted_folder', { error: { message: error.message } })
    }
  }
}

export default MessengerFolderRosterController
