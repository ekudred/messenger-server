const uuid = require('uuid')
import { Op } from 'sequelize'

import DataBase from '../../database'
import {
  GetChatsDTO,
  SearchChatsDTO,
  GetDialogsDTO,
  CreateDialogDTO,
  CreateGroupDTO
} from '../../dtos/socket/chat-roster.dto'
import { GetChatDTO } from '../../dtos/socket/chat.dto'
import { DialogDTO } from '../../dtos/common/dialog.dto'
import { GroupDTO } from '../../dtos/common/group.dto'
import { UserDTO } from '../../dtos/common/user.dto'
import ErrorAPI from '../../exceptions/ErrorAPI'

interface GetChatOptions extends GetChatDTO {
}

interface GetChatsOptions extends GetChatsDTO {
}

interface GetDialogsOptions extends GetDialogsDTO {
}

interface SearchChatsOptions extends SearchChatsDTO {
}

interface CreateDialogOptions extends CreateDialogDTO {
}

interface CreateGroupOptions extends CreateGroupDTO {
}

class ChatService {
  public static async getChat(options: GetChatOptions) {
    const { type, id, userID } = options

    switch (type) {
      case 'dialog':
        const dialog = await DataBase.models.Dialog.scope(['roster', 'messages']).findOne({ where: { id } })
        return { type, dialog: new DialogDTO(dialog, userID) }
      case 'group':
        const group = await DataBase.models.Group.scope(['roster', 'messages', 'creator']).findOne({ where: { id } })
        return { type, group: new GroupDTO(group) }
    }
  }

  public static async getChats(options: GetChatsOptions) {
    const { userID } = options

    const userDialogs = await DataBase.models.DialogRoster.scope([{ method: ['getDialog', ['roster']] }]).findAll({ where: { user_id: userID } })
    const dialogs = userDialogs.length !== 0 ? userDialogs.map((userDialog: any) => ({
      type: 'dialog', chat: new DialogDTO(userDialog.dialog, userID)
    })) : []

    const userGroups = await DataBase.models.GroupRoster.scope([{ method: ['getGroup', ['roster', 'creator']] }]).findAll({ where: { user_id: userID } })
    const groups = userGroups.length !== 0 ? userGroups.map((userGroup: any) => {
      return { type: 'group', chat: new GroupDTO(userGroup.group) }
    }) : []

    const chats = [...dialogs, ...groups]

    return { chats }
  }

  public static async getDialogs(options: GetDialogsOptions) {
    const { userID } = options

    const userDialogs = await DataBase.models.DialogRoster.scope([{ method: ['getDialog', ['roster']] }]).findAll({ where: { user_id: userID } })
    const dialogs = userDialogs.length !== 0 ? userDialogs.map((userDialog: any) => new DialogDTO(userDialog.dialog, userID)) : []

    return { dialogs }
  }

  public static async searchChats(options: SearchChatsOptions) {
    const { value, userID } = options

    const userDialogs = await DataBase.models.DialogRoster.scope([{ method: ['getDialog', ['roster']] }]).findAll({ where: { user_id: userID } })
    const dialogs = userDialogs.map((userDialog: any) => ({
      type: 'dialog', chat: new DialogDTO(userDialog.dialog, userID)
    }))

    const userGroups = await DataBase.models.GroupRoster.scope([{ method: ['searchLikeName', value] }, { method: ['getGroup', ['roster', 'creator']] }]).findAll({ where: { user_id: userID } })
    const groups = userGroups.map((userGroup: any) => ({
      type: 'group', chat: new GroupDTO(userGroup.group)
    }))

    const users = await DataBase.models.User.scope(['safeAttributes']).findAll({
      where: {
        id: { [Op.not]: userID },
        username: { [Op.like]: `%${value}%` }
      }
    })

    const filteredUsers = value.trim() !== '' ? users
      .map((user: any) => new UserDTO(user))
      .filter((user: any) => !dialogs.some((dialog: any) => dialog.chat.companion.id === user.id)) : []

    const filteredDialogs = dialogs.filter((dialog: any) => users.some((user: any) => dialog.chat.companion.id === user.id))

    const chats = [...filteredDialogs, ...groups]

    return { users: filteredUsers, chats }
  }

  public static async createDialog(options: CreateDialogOptions) {
    const { userID, companionID } = options

    const dialog = await DataBase.models.Dialog.create({ id: uuid.v4() })

    const dialogRosterBulkOptions = [
      { id: uuid.v4(), dialog_id: dialog.id, user_id: userID },
      { id: uuid.v4(), dialog_id: dialog.id, user_id: companionID }
    ]
    await DataBase.models.DialogRoster.bulkCreate(dialogRosterBulkOptions)

    const createdDialog = await DataBase.models.DialogRoster.scope([{ method: ['getDialog', ['roster']] }]).findOne({ where: { dialog_id: dialog.id } })

    return { dialog: new DialogDTO(createdDialog.dialog, userID) }
  }

  public static async createGroup(options: CreateGroupOptions) {
    const { creatorID, name, roster } = options // + image

    if (roster.length < 2) throw ErrorAPI.badRequest('Membership is not enough')

    const group = await DataBase.models.Group.create({ id: uuid.v4(), creator_id: creatorID, name })
    const groupRoster = [{ userID: creatorID }, ...roster]

    const groupRosterBulkOptions = groupRoster.map(item => ({
      id: uuid.v4(),
      group_id: group.id,
      user_id: item.userID
    }))
    await DataBase.models.GroupRoster.bulkCreate(groupRosterBulkOptions)

    const createdGroup = await DataBase.models.GroupRoster.scope([{ method: ['getGroup', ['roster', 'creator']] }]).findOne({ where: { group_id: group.id } })

    return { group: new GroupDTO(createdGroup.group) }
  }
}

export default ChatService
