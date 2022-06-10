const uuid = require('uuid')

import { Op } from 'sequelize'

import DataBase from '../../database'
import ErrorAPI from '../../exceptions/ErrorAPI'
import {
  CreateFolderOptions,
  CreateFolderResponse,
  EditFolderOptions,
  EditFolderResponse,
  SearchFolderChatsOptions,
  SearchFolderChatsResponse,
  SearchFolderDialogsOptions,
  SearchFolderDialogsResponse,
  SearchFolderGroupsOptions,
  SearchFolderGroupsResponse,
  DeleteFolderOptions,
  DeleteFolderResponse,
  FindFolderOptions,
  FindFolderResponse,
  FindFoldersOptions,
  FindFoldersResponse
} from './types'
import { DialogChat, GroupChat } from '../chat/types'
import TransformedFolder from '../../helpers/folder'
import TransformedDialog from '../../helpers/dialog'
import TransformedGroup from '../../helpers/group'
import { sortChats } from '../../helpers/common'

class FolderService {
  static async createFolder(options: CreateFolderOptions): Promise<CreateFolderResponse> {
    const { userID, name, dialogs, groups } = options

    const checkFolder = await DataBase.models.Folder.findOne({ where: { user_id: userID, name } })
    if (checkFolder) throw ErrorAPI.badRequest(`You already have a folder with name "${name}"`)

    const createdFolder = await DataBase.models.Folder.create({ id: uuid.v4(), user_id: userID, name })

    if (dialogs.length !== 0) {
      const dialogsBulkOptions = dialogs.map((dialog: any) => ({ folder_id: createdFolder.id, dialog_id: dialog.id }))
      await DataBase.models.FolderDialogRoster.bulkCreate(dialogsBulkOptions)
    }
    if (groups.length !== 0) {
      const groupsBulkOptions = groups.map((group: any) => ({ folder_id: createdFolder.id, group_id: group.id }))
      await DataBase.models.FolderGroupRoster.bulkCreate(groupsBulkOptions)
    }

    const folder = await this.findFolder({ id: createdFolder.id })

    return { folder }
  }

  static async editFolder(options: EditFolderOptions): Promise<EditFolderResponse> {
    const { folderID, folderName, roster } = options
    const { added, deleted } = roster
    const folder = await DataBase.models.Folder.findOne({ where: { id: folderID } })

    if (folder.name !== folderName) {
      await DataBase.models.Folder.update({ name: folderName }, { where: { id: folderID } })
    }

    if (deleted.dialogs.length !== 0) {
      await DataBase.models.FolderDialogRoster.destroy({
        where: { dialog_id: { [Op.or]: deleted.dialogs.map((item: any) => item.id) }, folder_id: folder.id }
      })
    }
    if (deleted.groups.length !== 0) {
      await DataBase.models.FolderGroupRoster.destroy({
        where: { group_id: { [Op.or]: deleted.groups.map((item: any) => item.id) }, folder_id: folder.id }
      })
    }
    if (added.dialogs.length !== 0) {
      const dialogsBulkOptions = added.dialogs.map((dialog: any) => ({ folder_id: folder.id, dialog_id: dialog.id }))
      await DataBase.models.FolderDialogRoster.bulkCreate(dialogsBulkOptions)
    }
    if (added.groups.length !== 0) {
      const groupsBulkOptions = added.groups.map((group: any) => ({ folder_id: folder.id, group_id: group.id }))
      await DataBase.models.FolderGroupRoster.bulkCreate(groupsBulkOptions)
    }

    const editedFolder = await this.findFolder({ id: folder.id })

    return { folder: editedFolder }
  }

  static async searchFolderDialogs(options: SearchFolderDialogsOptions): Promise<SearchFolderDialogsResponse> {
    const { userID, folderID, value } = options

    const rosterDialogs = await DataBase.models.FolderDialogRoster
      .scope([{ method: ['dialog', {}] }])
      .findAll({
        where: { folder_id: folderID },
        order: [[
          { model: DataBase.models.Dialog, as: 'dialog' },
          { model: DataBase.models.DialogLastMessage, as: 'last_message' },
          'updated_at', 'DESC'
        ]]
      })

    const dialogs = rosterDialogs.map((rosterDialog: any) => {
      return { chat: rosterDialog.dialog, comrade: rosterDialog.dialog.roster.find((user: any) => user.id !== userID)! }
    })
    const filteredDialogs = dialogs.filter((dialog: any) => dialog.comrade.username.match(value))

    return filteredDialogs.map((dialog: any) => new TransformedDialog(dialog.chat))
  }

  static async searchFolderGroups(options: SearchFolderGroupsOptions): Promise<SearchFolderGroupsResponse> {
    const { folderID, value } = options

    const rosterGroups = await DataBase.models.FolderGroupRoster
      .scope([{ method: ['group', { where: { name: { [Op.like]: `%${value}%` } } }] }])
      .findAll({
        where: { folder_id: folderID },
        order: [[
          { model: DataBase.models.Group, as: 'group' },
          { model: DataBase.models.GroupLastMessage, as: 'last_message' },
          'updated_at', 'DESC'
        ]]
      })

    return rosterGroups.map((rosterGroup: any) => new TransformedGroup(rosterGroup.group))
  }

  static async findFolder(options: FindFolderOptions): Promise<FindFolderResponse> {
    const { id } = options

    const folder = await DataBase.models.Folder
      .scope([{ method: ['dialogs', {}] }, { method: ['groups', {}] }])
      .findOne({ where: { id } })

    return new TransformedFolder(folder)
  }

  static async findFolders(options: FindFoldersOptions): Promise<FindFoldersResponse> {
    const { userID } = options

    const folders = await DataBase.models.Folder
      .scope([{ method: ['dialogs', {}] }, { method: ['groups', {}] }])
      .findAll({
        where: { user_id: userID },
        order: [['created_at', 'ASC']]
      })

    return folders.map((folder: any) => new TransformedFolder(folder))
  }

  static async searchFolderChats(options: SearchFolderChatsOptions): Promise<SearchFolderChatsResponse> {
    const { folderID, userID, value } = options

    const dialogs = await this.searchFolderDialogs({ folderID, userID, value })
    const groups = await this.searchFolderGroups({ folderID, value })

    const dialogChats: DialogChat[] = dialogs.map(dialog => ({ type: 'user', chat: dialog }))
    const groupChats: GroupChat[] = groups.map(group => ({ type: 'group', chat: group }))

    const chats = sortChats([...dialogChats, ...groupChats])

    return { chats }
  }

  static async deleteFolder(options: DeleteFolderOptions): Promise<DeleteFolderResponse> {
    const { folderID, folderName } = options

    await DataBase.models.FolderDialogRoster.destroy({ where: { folder_id: folderID } })
    await DataBase.models.FolderGroupRoster.destroy({ where: { folder_id: folderID } })
    await DataBase.models.Folder.destroy({ where: { id: folderID } })

    return { folderID, folderName }
  }
}

export default FolderService
