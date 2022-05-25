import { Message, MessageUnread } from '../services/message/types'
import { ChatType } from '../services/chat/types'
import DialogMessageModel from '../database/models/dialog-message.model'
import GroupMessageModel from '../database/models/group-message.model'
import TransformedUser from './user'

interface TransformedMessageConstructor {
  chatType: ChatType
  chatID: string
  model: DialogMessageModel | GroupMessageModel
}

class TransformedMessage implements Message {
  public id: string
  public author: TransformedUser
  public chatType: ChatType
  public chatID: string
  public text: string
  public unread: MessageUnread[]
  public createdAt: Date
  public updatedAt: Date

  constructor(options: TransformedMessageConstructor) {
    const { chatType, chatID, model } = options

    this.id = model.id
    this.author = new TransformedUser(model.user)
    this.chatType = chatType
    this.chatID = chatID
    this.text = model.text
    this.unread = model.unread ? model.unread.map(item => ({ userID: item.roster_item.user.id })) : []
    this.createdAt = model.created_at
    this.updatedAt = model.updated_at
  }
}

export default TransformedMessage