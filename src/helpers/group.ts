import { Group } from '../services/group/types'
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
  public lastMessage: TransformedMessage | null
  public unreadMessages: TransformedMessage[] | null
  public createdAt: Date
  public updatedAt: Date

  constructor(model: GroupModel) {
    this.id = model.id
    this.name = model.name
    this.avatar = model.avatar
    this.creator = new TransformedUser(model.creator)
    this.roster = model.roster.map(item => new TransformedUser(item.user))
    this.messages = model.messages
      ? model.messages.map(message => new TransformedMessage({ chatType: 'group', chatID: model.id, model: message }))
      : []
    this.lastMessage = model.last_message
      ? new TransformedMessage({ chatType: 'group', chatID: model.id, model: model.last_message.message })
      : null
    this.unreadMessages = model.unread_messages
      ? model.unread_messages.map(unreadMessage => new TransformedMessage({
        chatType: 'user', chatID: model.id, model: unreadMessage.message
      }))
      : []
    this.createdAt = model.created_at
    this.updatedAt = model.updated_at
  }
}

export default TransformedGroup