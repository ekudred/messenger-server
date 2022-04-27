import { UserDTO } from './user.dto'
import { MessageDTO } from './message.dto'

export class GroupDTO {
  public id: string
  public name: string
  public image: string
  public creator: UserDTO
  public roster: UserDTO[]
  public messages: MessageDTO[]

  constructor(object: { [key: string]: any }, messages?: boolean) {
    this.id = object.id
    this.name = object.name
    this.image = object.image
    this.creator = object.creator
    this.roster = object.roster.map((item: any) => new UserDTO(item.user))
    this.messages = messages ? object.messages.map((item: any) => new MessageDTO('dialog', item)) : []
  }

  public toPlainObj(): Object {
    return Object.assign({}, this)
  }
}
