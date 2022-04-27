import { UserDTO } from './user.dto'
import { MessageDTO } from './message.dto'

export class DialogDTO {
  public id: string
  public companion: UserDTO
  public roster: UserDTO[]
  public messages: MessageDTO

  constructor(object: { [key: string]: any }, userID: string, messages?: boolean) {
    this.id = object.id

    const filteredRoster = object.roster.filter((item: any) => item.user.id !== userID)
    this.companion = new UserDTO(filteredRoster[0].user)

    this.roster = object.roster.map((item: any) => new UserDTO(item.user))
    this.messages = messages ? object.messages.map((item: any) => new MessageDTO('dialog', item)) : []
  }

  public toPlainObj(): Object {
    return Object.assign({}, this)
  }
}
