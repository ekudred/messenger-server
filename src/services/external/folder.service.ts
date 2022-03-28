const uuid = require('uuid')

import DataBase from '../../database'
import { EditDTO, CreateDTO, FindAllDTO, DeleteDTO } from '../../dtos/socket-controllers/messenger-folder-roster.dto'
import ErrorAPI from '../../exceptions/ErrorAPI'
import { toPlainObject } from '../../utils/helpers'

interface CreateOptions extends CreateDTO {}
interface EditOptions extends EditDTO {}
interface FindAllOptions extends FindAllDTO {}
interface DeleteOptions extends DeleteDTO {}

class FolderService {
  public static async create(options: CreateOptions) {
    const { userID, name, dialogs, groups } = options

    const checkFolder = await DataBase.models.Folder.findOne({ where: { user_id: userID, name } })
    if (checkFolder) throw ErrorAPI.badRequest(`You already have a folder with name "${name}"`)

    const folder = await DataBase.models.Folder.create({ id: uuid.v4(), user_id: userID, name })

    const dialogsFromDB =
      dialogs.length != 0
        ? dialogs.map(async dialog => {
            return await DataBase.models.FolderDialogRoster.create({ id: uuid.v4(), folder_id: folder.id, dialog_id: dialog.id })
          })
        : []

    const groupsFromDB =
      groups.length != 0
        ? groups.map(async group => {
            return await DataBase.models.FolderGroupRoster.create({ id: uuid.v4(), folder_id: folder.id, group_id: group.id })
          })
        : []

    const plainFolder = toPlainObject(folder)

    return { folder: { ...plainFolder, dialogs: dialogsFromDB, groups: groupsFromDB } }
  }

  public static async edit(options: EditOptions) {
    const { folderID, folderName } = options

    const folder = await DataBase.models.Folder.scope(['excludeAttributes', 'dialogs', 'groups']).findOne({ where: { id: folderID } })

    if (folder.name === folderName) throw ErrorAPI.badRequest('The folder name must not be repeated')
    folder.name = folderName

    folder.save()

    return { folder: toPlainObject(folder) }
  }

  public static async findAll(options: FindAllOptions) {
    // // ekudred
    // const dialog1 = await DataBase.models.Dialog.create({ id: uuid.v4(), user_id: '37c44354-a5e9-401b-b42f-c998daac5a9f' })
    // // ekudred roster
    // const dRoster11 = await DataBase.models.DialogRoster.create({
    //   id: uuid.v4(),
    //   dialog_id: dialog1.id,
    //   user_id: '37c44354-a5e9-401b-b42f-c998daac5a9f',
    // })
    // // alexander roster
    // const dRoster12 = await DataBase.models.DialogRoster.create({
    //   id: uuid.v4(),
    //   dialog_id: dialog1.id,
    //   user_id: '84c60f02-8713-4af0-bf79-65d2b5aab26f',
    // })

    // // alexander
    // const dialog2 = await DataBase.models.Dialog.create({ id: uuid.v4(), user_id: '84c60f02-8713-4af0-bf79-65d2b5aab26f' })
    // // ekudred roster
    // const dRoster21 = await DataBase.models.DialogRoster.create({
    //   id: uuid.v4(),
    //   dialog_id: dialog2.id,
    //   user_id: '37c44354-a5e9-401b-b42f-c998daac5a9f',
    // })
    // // alexander roster
    // const dRoster22 = await DataBase.models.DialogRoster.create({
    //   id: uuid.v4(),
    //   dialog_id: dialog2.id,
    //   user_id: '84c60f02-8713-4af0-bf79-65d2b5aab26f',
    // })

    // return { dialogs: { dialog1, dialog2 } }

    const { userID } = options

    const folders = await DataBase.models.Folder.scope(['excludeAttributes']).findAll({ where: { user_id: userID } })

    return { folders: toPlainObject(folders) }
  }

  public static async delete(options: DeleteOptions) {
    const { folderID, folderName } = options

    await DataBase.models.FolderDialogRoster.destroy({ where: { folder_id: folderID } })
    await DataBase.models.FolderGroupRoster.destroy({ where: { folder_id: folderID } })
    await DataBase.models.Folder.destroy({ where: { id: folderID } })

    return { folderID, folderName }
  }
}

export default FolderService
