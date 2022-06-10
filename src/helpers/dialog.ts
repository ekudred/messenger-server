import { Dialog } from '../services/dialog/types'
import TransformedUser from './user'
import TransformedMessage from './message'
import DialogModel from '../database/models/dialog.model'

class TransformedDialog implements Dialog {
  public id: string
  public roster: TransformedUser[]
  public messages: TransformedMessage[]
  public lastMessage: TransformedMessage | null
  public unreadMessages: TransformedMessage[] | null
  public createdAt: Date
  public updatedAt: Date

  constructor(model: DialogModel) {
    this.id = model.id
    this.roster = model.roster.map(item => new TransformedUser(item.user))
    this.messages = model.messages
      ? model.messages.map(message => new TransformedMessage({ chatType: 'user', chatID: model.id, model: message }))
      : []
    this.lastMessage = model.last_message
      ? new TransformedMessage({ chatType: 'user', chatID: model.id, model: model.last_message.message })
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

export default TransformedDialog