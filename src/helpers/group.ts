import { Group } from '../services/chat/types'
import TransformedUser from './user'
import TransformedMessage from './message'
import GroupModel from '../database/models/group.model'

class TransformedGroup implements Group {
  public id: string
  public name: string
  public avatar: string
  public creator: TransformedUser
  public roster: TransformedUser[]
  public messages: TransformedMessage[]
  public updatedMessagesAt: Date
  public createdAt: Date
  public updatedAt: Date

  constructor(model: GroupModel) {
    this.id = model.id
    this.name = model.name
    this.avatar = model.avatar
    this.creator = new TransformedUser(model.creator)
    this.roster = model.roster.map(item => new TransformedUser(item.user))
    this.messages = model.messages.map(message => new TransformedMessage({
      chatType: 'group', chatID: model.id, model: message
    }))
    this.updatedMessagesAt = model.updated_messages_at
    this.createdAt = model.created_at
    this.updatedAt = model.updated_at
  }
}

export default TransformedGroup