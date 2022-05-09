import { Group } from '../services/chat/types'
import TransformedUser from './user'
import TransformedMessage from './message'

class TransformedGroup implements Group {
  public id: string
  public name: string
  public avatar: string
  public creator: TransformedUser
  public roster: TransformedUser[]
  public messages: TransformedMessage[]
  public createdAt: string
  public updatedAt: string

  constructor(object: { [key: string]: any }) {
    this.id = object.id
    this.name = object.name
    this.avatar = object.avatar
    this.creator = new TransformedUser(object.creator)
    this.roster = object.roster.map((item: any) => new TransformedUser(item.user))
    this.messages = object.messages ? object.messages.map((item: any) => new TransformedMessage('dialog', item)) : []
    this.createdAt = object.createdAt
    this.updatedAt = object.updatedAt
  }
}

export default TransformedGroup