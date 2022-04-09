const uuid = require('uuid')

import DataBase from '../../database'
import { EditFolderDTO, CreateFolderDTO, GetFoldersDTO, DeleteFolderDTO } from '../../dtos/socket-controllers/messenger-folder-roster.dto'
import ErrorAPI from '../../exceptions/ErrorAPI'
import { toPlainObject } from '../../utils/helpers'

interface CreateFolderOptions extends CreateFolderDTO {}
interface EditFolderOptions extends EditFolderDTO {}
interface GetFoldersOptions extends GetFoldersDTO {}
interface DeleteFolderOptions extends DeleteFolderDTO {}

class FolderService {
  public static async create(options: CreateFolderOptions) {
    const { userID, name, dialogs, groups } = options

    const checkFolder = await DataBase.models.Folder.findOne({ where: { user_id: userID, name } })
    if (checkFolder) throw ErrorAPI.badRequest(`You already have a folder with name "${name}"`)

    const folder = await DataBase.models.Folder.create({ id: uuid.v4(), user_id: userID, name })

    // const dialogsFromDB =
    //   dialogs.length != 0
    //     ? dialogs.map(async dialog => {
    //         return await DataBase.models.FolderDialogRoster.create({ id: uuid.v4(), folder_id: folder.id, dialog_id: dialog.id })
    //       })
    //     : []

    // const groupsFromDB =
    //   groups.length != 0
    //     ? groups.map(async group => {
    //         return await DataBase.models.FolderGroupRoster.create({ id: uuid.v4(), folder_id: folder.id, group_id: group.id })
    //       })
    //     : []

    const plainFolder = toPlainObject(folder)

    return { folder: { ...plainFolder, dialogs: [], groups: [] } }
  }

  public static async edit(options: EditFolderOptions) {
    const { folderID, folderName } = options

    const folder = await DataBase.models.Folder.scope(['attributes', 'dialogs', 'groups']).findOne({ where: { id: folderID } })

    if (folder.name === folderName) throw ErrorAPI.badRequest('The folder name must not be repeated')
    folder.name = folderName

    folder.save()

    return { folder: toPlainObject(folder) }
  }

  public static async get(options: GetFoldersOptions) {
    const { userID } = options

    const folders = await DataBase.models.Folder.scope(['attributes']).findAll({ where: { user_id: userID } })

    return { folders: toPlainObject(folders) }
  }

  public static async delete(options: DeleteFolderOptions) {
    const { folderID, folderName } = options

    await DataBase.models.FolderDialogRoster.destroy({ where: { folder_id: folderID } })
    await DataBase.models.FolderGroupRoster.destroy({ where: { folder_id: folderID } })
    await DataBase.models.Folder.destroy({ where: { id: folderID } })

    return { folderID, folderName }
  }
}

export default FolderService
