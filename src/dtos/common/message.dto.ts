import { ChatType } from '../../utils/types'

export class MessageDTO {
  public id!: string
  public userID!: string
  public chatType!: ChatType
  public chatID!: string
  public text!: string
  public createdAt!: string
  public updatedAt!: string

  constructor(chatType: ChatType, object: { [key: string]: any }) {
    this.id = object.id
    this.userID = object.user_id
    this.chatType = chatType
    this.chatID = object[`${chatType}_id`]
    this.text = object.text
    this.createdAt = object.createdAt
    this.updatedAt = object.updatedAt
  }

  public toPlainObj(): Object {
    return Object.assign({}, this)
  }
}
