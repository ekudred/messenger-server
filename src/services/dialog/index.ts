import { Op } from 'sequelize'

import DataBase from '../../database'
import {
  CreateDialogOptions,
  CreateDialogResponse,
  FindDialogsOptions,
  FindDialogsResponse,
  FindDialogOptions,
  FindDialogResponse,
  SearchDialogsOptions,
  SearchDialogsResponse,
  HandleDialogOptions,
  HandleDialogResponse
} from './types'
import TransformedDialog from '../../helpers/dialog'

class DialogService {
  static async createDialog(options: CreateDialogOptions): Promise<CreateDialogResponse> {
    const { userID, comradeID } = options

    const createdDialog = await DataBase.models.Dialog.create()

    const dialogRosterBulkOptions = [
      { dialog_id: createdDialog.id, user_id: userID },
      { dialog_id: createdDialog.id, user_id: comradeID }
    ]
    await DataBase.models.DialogRoster.bulkCreate(dialogRosterBulkOptions)

    const userDialogBulkOptions = [
      { dialog_id: createdDialog.id, user_id: userID, comrade_id: comradeID },
      { dialog_id: createdDialog.id, user_id: comradeID, comrade_id: userID }
    ]
    await DataBase.models.UserDialog.bulkCreate(userDialogBulkOptions)

    return (await this.findDialog({ dialogID: createdDialog.id, active: false }))!
  }

  static async findDialogs(options: FindDialogsOptions): Promise<FindDialogsResponse> {
    const { userID, comradeID, active } = options

    const userDialogs = await DataBase.models.UserDialog
      .scope([{ method: ['dialog', {}] }])
      .findAll({
        where: comradeID
          ? { user_id: userID, comrade_id: comradeID, active }
          : { user_id: userID, active },
        order: [[
          { model: DataBase.models.Dialog, as: 'dialog' },
          { model: DataBase.models.DialogLastMessage, as: 'last_message' },
          'updated_at', 'DESC'
        ]]
      })

    if (!userDialogs) {
      return []
    }

    return userDialogs.map((userDialog: any) => new TransformedDialog(userDialog.dialog))
  }

  static async findDialog(options: FindDialogOptions): Promise<FindDialogResponse> {
    const { dialogID, active } = options

    const userDialog = await DataBase.models.UserDialog
      .scope([{ method: ['dialog', {}] }])
      .findOne({ where: { dialog_id: dialogID, active: active } })

    if (!userDialog) {
      return null
    }

    return new TransformedDialog(userDialog.dialog)
  }

  static async searchDialogs(options: SearchDialogsOptions): Promise<SearchDialogsResponse> {
    const { userID, value } = options

    if (value.trim() === '') {
      return []
    }

    const userDialogs = await DataBase.models.UserDialog
      .scope([
        { method: ['comrade', { where: { username: { [Op.like]: `%${value}%` } } }] },
        { method: ['dialog', {}] }
      ])
      .findAll({
        where: { user_id: userID, active: true },
        order: [[
          { model: DataBase.models.Dialog, as: 'dialog' },
          { model: DataBase.models.DialogLastMessage, as: 'last_message' },
          'updated_at', 'DESC'
        ]]
      })

    return userDialogs.map((userDialog: any) => new TransformedDialog(userDialog.dialog))
  }

  static async handleDialog(options: HandleDialogOptions): Promise<HandleDialogResponse> {
    const { id } = options

    const count = await DataBase.models.DialogMessage.count({ where: { dialog_id: id } })

    const userDialogs = await DataBase.models.UserDialog.findAll({ where: { dialog_id: id } })
    const active = userDialogs.every((userDialog: any) => userDialog.active === true)

    let created = false

    for await (const userDialog of userDialogs) {
      if (count === 0 && active) {
        userDialog.active = false
      }
      if (count !== 0 && !active) {
        userDialog.active = true
        created = true
      }

      await userDialog.save()
    }

    return { created }
  }
}

export default DialogService