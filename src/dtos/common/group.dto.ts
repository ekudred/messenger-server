import { UserDTO } from './user.dto'
import { MessageDTO } from './message.dto'

export class GroupDTO {
  public id: string
  public name: string
  public avatar: string
  public creator: UserDTO
  public roster: UserDTO[]
  public messages: MessageDTO[]
  public createdAt: string
  public updatedAt: string

  constructor(object: { [key: string]: any }) {
    this.id = object.id
    this.name = object.name
    this.avatar = object.avatar
    this.creator = new UserDTO(object.creator)
    this.roster = object.roster.map((item: any) => new UserDTO(item.user))
    this.messages = object.messages ? object.messages.map((item: any) => new MessageDTO('dialog', item)) : []
    this.createdAt = object.createdAt
    this.updatedAt = object.updatedAt
  }
}
