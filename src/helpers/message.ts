import { Message } from '../services/message/types'
import { ChatType } from '../services/chat/types'
import DialogMessageModel from '../database/models/dialog-message.model'
import GroupMessageModel from '../database/models/group-message.model'

interface TransformedMessageConstructor {
  chatType: ChatType
  chatID: string
  model: DialogMessageModel | GroupMessageModel
}

class TransformedMessage implements Message {
  public id: string
  public userID: string
  public chatType: ChatType
  public chatID: string
  public text: string
  public createdAt: string
  public updatedAt: string

  constructor(options: TransformedMessageConstructor) {
    const { chatType, chatID, model } = options

    this.id = model.id
    this.userID = model.user_id
    this.chatType = chatType
    this.chatID = chatID
    this.text = model.text
    this.createdAt = model.createdAt
    this.updatedAt = model.updatedAt
  }
}

export default TransformedMessage