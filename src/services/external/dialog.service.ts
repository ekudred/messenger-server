const uuid = require('uuid')

import DataBase from '../../database'
import Dialog from '../../database/models/dialog.model'
import DialogRoster from '../../database/models/dialog-roster.model'

interface CreateOptions {
  user1ID: string
  user2ID: string
}

class DialogService {
  public static async create(options: CreateOptions) {
    const { user1ID, user2ID } = options

    const dialog = await Dialog.scope(['roster']).findAll()
    // console.log(dialog)

    // console.log(dialog[0].roster)
    // const dialog = await DataBase.models.Dialog.create({ id: uuid.v4() })
    // const roster1 = await DataBase.models.DialogRoster.create({ id: uuid.v4(), dialog_id: dialog.id, user_id: user1ID })
    // const roster2 = await DataBase.models.DialogRoster.create({ id: uuid.v4(), dialog_id: dialog.id, user_id: user2ID })

    return dialog
  }
}

export default DialogService
