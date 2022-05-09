import { Folder } from '../services/folder/types'
import TransformedDialog from './dialog'
import TransformedGroup from './group'

class TransformedFolder implements Folder {
  public id: string
  public name: string
  public userID: string
  public roster: (TransformedDialog | TransformedGroup)[]
  public createdAt: string
  public updatedAt: string

  constructor(object: { [key: string]: any }) {
    this.id = object.id
    this.userID = object.user_id
    this.name = object.name

    const dialogs = object.dialogs.map((folderDialog: any) => ({
      type: 'dialog', chat: new TransformedDialog(folderDialog.dialog, object.user_id)
    }))
    const groups = object.groups.map((folderGroup: any) => ({ type: 'group', chat: new TransformedGroup(folderGroup.group) }))

    this.roster = [ ...dialogs, ...groups ]
    this.createdAt = object.createdAt
    this.updatedAt = object.updatedAt
  }
}

export default TransformedFolder