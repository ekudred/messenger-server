import DataBase from '../../database'
import { toPlainObject } from '../../utils/helpers'

interface GetOptions {
  userID: string
}

class ChatService {
  public static async get(options: GetOptions) {
    const { userID } = options

    const dialogs = await DataBase.models.Dialog.scope(['excludeAttributes', 'user', 'roster']).findAll({ where: { user_id: userID } })
    const groups = await DataBase.models.Group.scope(['excludeAttributes', 'user', 'roster']).findAll({ where: { user_id: userID } })

    const transformedDialogs = toPlainObject(dialogs).map((dialog: any) => {
      const companion = dialog.roster.filter((rosterItem: any) => rosterItem.user.id !== dialog.user.id)

      return { ...dialog, companion: companion[0].user }
    })

    return { dialogs: transformedDialogs, groups: toPlainObject(groups) }
  }
}

export default ChatService
