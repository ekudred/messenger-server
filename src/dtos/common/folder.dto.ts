import { DialogDTO } from './dialog.dto'
import { GroupDTO } from './group.dto'

export class FolderDTO {
  public id: string
  public name: string
  public userID: string
  public roster: (DialogDTO | GroupDTO)[]
  public createdAt: string
  public updatedAt: string

  constructor(object: { [key: string]: any }) {
    this.id = object.id
    this.userID = object.user_id
    this.name = object.name

    const dialogs = object.dialogs.map((folderDialog: any) => ({
      type: 'dialog', chat: new DialogDTO(folderDialog.dialog, object.user_id)
    }))
    const groups = object.groups.map((folderGroup: any) => ({ type: 'group', chat: new GroupDTO(folderGroup.group) }))

    this.roster = [ ...dialogs, ...groups ]
    this.createdAt = object.createdAt
    this.updatedAt = object.updatedAt
  }
}
