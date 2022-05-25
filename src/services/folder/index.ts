const uuid = require('uuid')

import { Op } from 'sequelize'

import DataBase from '../../database'
import {
  CreateFolderOptions,
  CreateFolderResponse,
  EditFolderOptions,
  EditFolderResponse,
  GetFoldersOptions,
  GetFoldersResponse,
  SearchFolderChatsOptions,
  SearchFolderChatsResponse,
  DeleteFolderOptions,
  DeleteFolderResponse
} from './types'
import { DialogChat, GroupChat } from '../chat/types'
import Folder from '../../helpers/folder'
import Dialog from '../../helpers/dialog'
import Group from '../../helpers/group'
import ErrorAPI from '../../exceptions/ErrorAPI'

class FolderService {
  public static async createFolder(options: CreateFolderOptions): Promise<CreateFolderResponse> {
    const { userID, name, dialogs, groups } = options

    const checkFolder = await DataBase.models.Folder.findOne({ where: { user_id: userID, name } })
    if (checkFolder) throw ErrorAPI.badRequest(`You already have a folder with name "${name}"`)

    const folder = await DataBase.models.Folder.create({ id: uuid.v4(), user_id: userID, name })

    if (dialogs.length !== 0) {
      const dialogsBulkOptions = dialogs.map((dialog: any) => ({
        id: uuid.v4(), folder_id: folder.id, dialog_id: dialog.id
      }))
      await DataBase.models.FolderDialogRoster.bulkCreate(dialogsBulkOptions)
    }

    if (groups.length !== 0) {
      const groupsBulkOptions = groups.map((group: any) => ({
        id: uuid.v4(), folder_id: folder.id, group_id: group.id
      }))
      await DataBase.models.FolderGroupRoster.bulkCreate(groupsBulkOptions)
    }

    const createdFolder = await DataBase.models.Folder.scope(['roster']).findOne({ where: { id: folder.id } })
    const transformedFolder = new Folder(createdFolder)

    return { folder: transformedFolder }
  }

  public static async editFolder(options: EditFolderOptions): Promise<EditFolderResponse> {
    const { folderID, folderName, roster } = options

    const folder = await DataBase.models.Folder.scope(['roster']).findOne({ where: { id: folderID } })

    if (folder.name !== folderName) {
      folder.name = folderName
      // await DataBase.models.Folder.update({ name: folderName }, { where: { id: folderID } })
    }

    if (roster.deleted.dialogs.length !== 0) {
      await DataBase.models.FolderDialogRoster.destroy({
        where: { dialog_id: { [Op.or]: roster.deleted.dialogs.map((item: any) => item.id) }, folder_id: folder.id }
      })
    }
    if (roster.deleted.groups.length !== 0) {
      await DataBase.models.FolderGroupRoster.destroy({
        where: { group_id: { [Op.or]: roster.deleted.groups.map((item: any) => item.id) }, folder_id: folder.id }
      })
    }
    if (roster.added.dialogs.length !== 0) {
      const dialogsBulkOptions = roster.added.dialogs.map((dialog: any) => ({
        id: uuid.v4(), folder_id: folder.id, dialog_id: dialog.id
      }))
      await DataBase.models.FolderDialogRoster.bulkCreate(dialogsBulkOptions)
    }
    if (roster.added.groups.length !== 0) {
      const groupsBulkOptions = roster.added.groups.map((group: any) => ({
        id: uuid.v4(), folder_id: folder.id, group_id: group.id
      }))
      await DataBase.models.FolderGroupRoster.bulkCreate(groupsBulkOptions)
    }

    // await folder.reload()
    await folder.save()

    const editedFolder = await DataBase.models.Folder.scope(['roster']).findOne({ where: { id: folderID } })
    const transformedFolder = new Folder(editedFolder)

    return { folder: transformedFolder }
  }

  public static async getFolders(options: GetFoldersOptions): Promise<GetFoldersResponse> {
    const { userID } = options

    const folders = await DataBase.models.Folder.scope(['roster']).findAll({ where: { user_id: userID } })
    const transformedFolders = folders.map((folder: any) => new Folder(folder))

    return { folders: transformedFolders }
  }

  public static async searchFolderChats(options: SearchFolderChatsOptions): Promise<SearchFolderChatsResponse> {
    const { folderID, userID, value } = options

    const folderDialogs = await DataBase.models.FolderDialogRoster
      .findAll({ where: { folder_id: folderID } })
    const dialogs: DialogChat[] = folderDialogs.map((folderDialog: any) => ({
      type: 'user', chat: new Dialog(folderDialog.dialog)
    }))
    const transformedDialogs = dialogs.map(dialog => {
      const { type, chat } = dialog
      const comrade = dialog.chat.roster.find(user => user.id !== userID)!
      return { type, chat: { ...chat, comrade } }
    })
    const filteredDialogs = transformedDialogs.filter(dialog => dialog.chat.comrade.username.match(value))

    const folderGroups = await DataBase.models.FolderGroupRoster
      .scope([{ method: ['searchLikeName', value] }])
      .findAll({ where: { folder_id: folderID } })
    const groups: GroupChat[] = folderGroups.map((folderGroup: any) => ({
      type: 'group', chat: new Group(folderGroup.group)
    }))

    const chats = [...filteredDialogs, ...groups]

    return { userID, folderID, chats }
  }

  public static async deleteFolder(options: DeleteFolderOptions): Promise<DeleteFolderResponse> {
    const { folderID, folderName } = options

    await DataBase.models.FolderDialogRoster.destroy({ where: { folder_id: folderID } })
    await DataBase.models.FolderGroupRoster.destroy({ where: { folder_id: folderID } })
    await DataBase.models.Folder.destroy({ where: { id: folderID } })

    return { folderID, folderName }
  }
}

export default FolderService
