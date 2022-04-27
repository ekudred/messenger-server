import { DialogDTO } from './dialog.dto'
import { GroupDTO } from './group.dto'

export class FolderDTO {
  public id: string
  public name: string
  public userID: string
  public roster: {
    dialogs: DialogDTO
    groups: GroupDTO
  }

  constructor(object: { [key: string]: any }) {
    this.id = object.id
    this.userID = object.user_id
    this.name = object.name

    const dialogs = object.dialogs.map((folderDialog: any) => new DialogDTO(folderDialog.dialog, object.user_id))
    const groups = object.groups.map((folderGroup: any) => new GroupDTO(folderGroup.group))

    this.roster = { dialogs, groups }
  }
}
