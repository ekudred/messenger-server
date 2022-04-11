const uuid = require('uuid')
import { Op } from 'sequelize'

import DataBase from '../../database'
import { EditFolderDTO, CreateFolderDTO, GetFoldersDTO, DeleteFolderDTO } from '../../dtos/socket-controllers/messenger-folder-roster.dto'
import ErrorAPI from '../../exceptions/ErrorAPI'
import { toPlainObject, transformDialog, transformGroup } from '../../utils/helpers'

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

    const getTransformedDialogs = async (dialogs: any) => {
      if (dialogs.length !== 0) {
        const dialogsBulkOptions = dialogs.map((dialog: any) => ({ id: uuid.v4(), folder_id: folder.id, dialog_id: dialog.id }))
        const createdFolderDialogs = await DataBase.models.FolderDialogRoster.bulkCreate(dialogsBulkOptions)
        const folderDialogsIDs = createdFolderDialogs.map((item: any) => item.id)
        const folderDialogs = await DataBase.models.FolderDialogRoster.findAll({ where: { id: { [Op.or]: folderDialogsIDs } } })

        return folderDialogs.map((folderDialog: any) => transformDialog(folderDialog.dialog, userID))
      }

      return []
    }
    const getTransformedGroups = async (groups: any) => {
      if (groups.length !== 0) {
        const groupsBulkOptions = groups.map((group: any) => ({ id: uuid.v4(), folder_id: folder.id, group_id: group.id }))
        const createdFolderGroups = await DataBase.models.FolderGroupRoster.bulkCreate(groupsBulkOptions)
        const folderGroupsIDs = createdFolderGroups.map((item: any) => item.id)
        const folderGroups = await DataBase.models.FolderGroupRoster.findAll({ where: { id: { [Op.or]: folderGroupsIDs } } })

        return folderGroups.map((folderGroup: any) => transformGroup(folderGroup.group))
      }

      return []
    }

    const transformedDialogs = await getTransformedDialogs(dialogs)
    const transformedGroups = await getTransformedGroups(groups)

    const roster = { dialogs: transformedDialogs, groups: transformedGroups }
    const transformedFolder = toPlainObject({ id: folder.id, name: folder.name, roster })

    return { folder: transformedFolder }
  }

  public static async edit(options: EditFolderOptions) {
    const { folderID, folderName } = options

    const folder = await DataBase.models.Folder.scope(['attributes', 'roster']).findOne({ where: { id: folderID } })

    if (folder.name === folderName) throw ErrorAPI.badRequest('The folder name must not be repeated')
    folder.name = folderName

    folder.save()

    const transformedFolder = toPlainObject({ id: folder.id, name: folder.name, roster: { dialogs: [], groups: [] } })

    return { folder: transformedFolder }
  }

  public static async get(options: GetFoldersOptions) {
    const { userID } = options

    const folders = await DataBase.models.Folder.scope(['attributes', 'roster']).findAll({ where: { user_id: userID } })

    const transformedFolders = toPlainObject(folders).map((folder: any) => {
      const transformedDialogs = folder.dialogs.map((folderDialog: any) => transformDialog(folderDialog.dialog, userID))
      const transformedGroups = folder.groups.map((folderGroup: any) => transformGroup(folderGroup.group))

      return {
        id: folder.id,
        name: folder.name,
        roster: { dialogs: transformedDialogs, groups: transformedGroups },
      }
    })

    return { folders: transformedFolders }
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
