import { ChatType, DialogChat, GroupChat } from '../chat/types'
import { User } from '../user/types'

export interface Message {
  id: string
  author: User
  chatType: ChatType
  chatID: string
  text: string
  unread: MessageUnread[]
  createdAt: Date
  updatedAt: Date
}

export interface MessageUnread {
  userID: string
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

// HandleNewMessage

export interface HandleNewMessageOptions {
  message: Message
}

export interface HandleNewMessageResponse {
  chat: DialogChat | GroupChat
  message: Message
  roster: User[]
}

// ViewMessage

export interface ViewMessagesOptions {
  userID: string
  chatType: ChatType
  chatID: string
  roster: User[]
  viewMessages: { id: string }[]
  unreadMessages: number
}

export interface ViewMessagesResponse {
  userID: string
  chatType: ChatType
  chatID: string
  roster: User[]
  readMessages: { id: string }[]
  unreadMessages: number
}

// CreateDialogMessage

export interface CreateDialogMessageOptions {
  messageID: string
  userID: string
  dialogID: string
  text: string
}

export interface CreateDialogMessageResponse {
  message: Message
}

// CreateGroupMessage

export interface CreateGroupMessageOptions {
  messageID: string
  userID: string
  groupID: string
  text: string
}

export interface CreateGroupMessageResponse {
  message: Message
}
