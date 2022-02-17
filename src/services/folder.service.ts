const uuid = require('uuid')

import DataBase from '../database'
import { AddDTO, CreateDTO, FindAllDTO, DeleteDTO } from '../dtos/folder.dto'

interface CreateOptions extends CreateDTO {}
interface AddOptions extends AddDTO {}
interface FindAllOptions extends FindAllDTO {}
interface DeleteOptions extends DeleteDTO {}

class FolderService {
  public static async create(options: CreateOptions) {
    const { userID, name, chats } = options

    const folder = await DataBase.models.Folder.create({ id: uuid.v4(), user_id: userID, name })

    let folderRoster: any = []
    if (Object.keys(chats).length !== 0) {
      folderRoster = chats.map(async chat => {
        return await DataBase.models.FolderRoster.create({ id: uuid.v4(), chat_id: chat.id, user_id: userID })
      })
    }

    return { folder, folderRoster }
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
    const foldersRoster = await DataBase.models.FolderRoster.findAll({ where: { user_id: userID } })

    return { folders, foldersRoster }
  }

  public static async delete(options: DeleteOptions) {
    const { folderID } = options

    await DataBase.models.Folder.destroy({ where: { id: folderID } })
    await DataBase.models.FolderRoster.destroy({ where: { folder_id: folderID } })
  }
}

export default FolderService
