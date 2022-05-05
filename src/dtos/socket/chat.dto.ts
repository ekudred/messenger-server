import { ChatType } from '../../utils/types'

export interface GetChatDTO {
  type: string
  id: string
  userID: string
}

export interface SendMessageDTO {
  messageID: string
  userID: string
  chatType: ChatType
  chatID: string
  text: string
}
