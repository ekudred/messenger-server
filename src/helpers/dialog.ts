import { Dialog } from '../services/chat/types'
import TransformedUser from './user'
import TransformedMessage from './message'

class TransformedDialog implements Dialog {
  public id: string
  public companion: TransformedUser
  public roster: TransformedUser[]
  public messages: TransformedMessage[]
  public createdAt: string
  public updatedAt: string

  constructor(object: { [key: string]: any }, userID: string) {
    this.id = object.id
    this.companion = new TransformedUser(object.roster.find((item: any) => item.user.id !== userID).user)
    this.roster = object.roster.map((item: any) => new TransformedUser(item.user))
    this.messages = object.messages ? object.messages.map((item: any) => new TransformedMessage('dialog', item)) : []
    this.createdAt = object.createdAt
    this.updatedAt = object.updatedAt
  }
}

export default TransformedDialog