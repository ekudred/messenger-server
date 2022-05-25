import { Dialog } from '../services/chat/types'
import TransformedUser from './user'
import TransformedMessage from './message'
import DialogModel from '../database/models/dialog.model'

class TransformedDialog implements Dialog {
  public id: string
  public roster: TransformedUser[]
  public messages: TransformedMessage[]
  public updatedMessagesAt: Date
  public createdAt: Date
  public updatedAt: Date

  constructor(model: DialogModel) {
    this.id = model.id
    this.roster = model.roster.map(item => new TransformedUser(item.user))
    this.messages = model.messages.map(message => new TransformedMessage({
      chatType: 'user', chatID: model.id, model: message
    }))
    this.updatedMessagesAt = model.updated_messages_at
    this.createdAt = model.created_at
    this.updatedAt = model.updated_at
  }
}

export default TransformedDialog