const uuid = require('uuid')

import DataBase from '../../database'
import DialogService from './dialog.service'
import { AddDTO, CreateDTO, FindAllDTO, DeleteDTO, FolderDTO } from '../../dtos/folder.dto'

interface CreateOptions extends CreateDTO {}
interface AddOptions extends AddDTO {}
interface FindAllOptions extends FindAllDTO {}
interface DeleteOptions extends DeleteDTO {}

class FolderService {
  public static async create(options: CreateOptions) {
    const { userID, name, chatIDs } = options

    // const folder = await DataBase.models.Folder.create({ id: uuid.v4(), user_id: userID, name })
    // const folderDTO = new FolderDTO(folder)
    
    const dialog = await DialogService.create({ user1ID: '5c58548a-cdc4-49f2-9cd7-0605781b73ae', user2ID: '6e971ccd-3eb9-4b00-ad22-ca4c82c01656' })

    return dialog
  }

  public static async add(options: AddOptions) {
    const { userID, chatIDs } = options

    const addedChats = chatIDs.map(async chatID => {
      return await DataBase.models.FolderRoster.create({ id: uuid.v4(), chat_id: chatID, user_id: userID })
    })

    return addedChats
  }

  public static async findAll(options: FindAllOptions) {
    const { userID } = options

    const folders = await DataBase.models.Folder.findAll({ where: { user_id: userID } })
    // const foldersRoster = await DataBase.models.FolderRoster.findAll({ where: { user_id: userID } })
    // console.log(folders)
    // const foldersDTO = folders.map((folder: any) => new FolderDTO(folder))
    // const foldersWithRoster = foldersDTO.map((folderDTO: any) => {
    //   return { ...folderDTO, chats: [] }
    // })

    return { folders: [] }
  }

  public static async delete(options: DeleteOptions) {
    const { folderID } = options

    await DataBase.models.Folder.destroy({ where: { id: folderID } })
    await DataBase.models.FolderRoster.destroy({ where: { folder_id: folderID } })
  }
}

export default FolderService
