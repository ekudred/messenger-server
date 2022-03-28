import { SocketController, OnMessage, MessageBody, ConnectedSocket } from 'socket-controllers'

import FolderService from '../services/external/folder.service'
import { CreateDTO, FindAllDTO, DeleteDTO, EditDTO } from '../dtos/socket-controllers/messenger-folder-roster.dto'

@SocketController()
class MessengerFolderRosterController {
  @OnMessage('messenger_folder_roster/find_all_folders')
  async findAll(@ConnectedSocket() socket: any, @MessageBody() message: FindAllDTO) {
    try {
      const data = await FolderService.findAll(message)

      socket.emit('messenger_folder_roster/folders', data)
    } catch (error: any) {
      socket.emit('messenger_folder_roster/folders', { error: { message: error.message } })
    }
  }

  @OnMessage('messenger_folder_roster/create_folder')
  async create(@ConnectedSocket() socket: any, @MessageBody() message: CreateDTO) {
    try {
      const data = await FolderService.create(message)

      socket.emit('messenger_folder_roster/created_folder', data)
    } catch (error: any) {
      socket.emit('messenger_folder_roster/created_folder', { error: { message: error.message } })
    }
  }

  @OnMessage('messenger_folder_roster/edit_folder')
  async edit(@ConnectedSocket() socket: any, @MessageBody() message: EditDTO) {
    try {
      const data = await FolderService.edit(message)

      socket.emit('messenger_folder_roster/edited_folder', data)
    } catch (error: any) {
      socket.emit('messenger_folder_roster/edited_folder', { error: { message: error.message } })
    }
  }

  @OnMessage('messenger_folder_roster/delete_folder')
  async delete(@ConnectedSocket() socket: any, @MessageBody() message: DeleteDTO) {
    try {
      const data = await FolderService.delete(message)

      socket.emit('messenger_folder_roster/deleted_folder', data)
    } catch (error: any) {
      socket.emit('messenger_folder_roster/deleted_folder', { error: { message: error.message } })
    }
  }
}

export default MessengerFolderRosterController
