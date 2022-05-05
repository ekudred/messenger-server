import { UserDTO } from './user.dto'
import { MessageDTO } from './message.dto'

export class DialogDTO {
  public id: string
  public companion: UserDTO
  public roster: UserDTO[]
  public messages: MessageDTO[]
  public createdAt: string
  public updatedAt: string

  constructor(object: { [key: string]: any }, userID: string) {
    this.id = object.id
    this.companion = new UserDTO(object.roster.find((item: any) => item.user.id !== userID).user)
    this.roster = object.roster.map((item: any) => new UserDTO(item.user))
    this.messages = object.messages ? object.messages.map((item: any) => new MessageDTO('dialog', item)) : []
    this.createdAt = object.createdAt
    this.updatedAt = object.updatedAt
  }
}
