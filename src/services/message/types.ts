import { ChatType } from '../chat/types'

export interface Message {
  id: string
  userID: string
  chatType: ChatType
  chatID: string
  text: string
  createdAt: string
  updatedAt: string
}

// SendMessage

export interface SendMessageOptions {
  messageID: string
  userID: string
  chatType: ChatType
  chatID: string
  text: string
}

export interface SendMessageResponse {
  message: Message
}