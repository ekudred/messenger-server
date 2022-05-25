import { Message } from '../message/types'
import { User } from '../user/types'

export type ChatType = 'user' | 'group'

export interface Group {
  id: string
  name: string
  avatar: string
  creator: User
  roster: User[]
  messages: Message[]
  updatedMessagesAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface Dialog {
  id: string
  roster: User[]
  messages: Message[]
  updatedMessagesAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface GroupChat {
  type: 'group',
  chat: Group
}

export interface DialogChat {
  type: 'user',
  chat: Dialog
}

// GetChat

export interface GetChatOptions {
  type: ChatType
  id: string
  userID: string
}

export interface GetChatResponse {
  userID: string
  chat: DialogChat | GroupChat
}

// GetChats

export interface GetChatsOptions {
  userID: string
}

export interface GetChatsResponse {
  userID: string
  chats: (DialogChat | GroupChat)[]
}

// GetDialogs

export interface GetDialogsOptions {
  userID: string
}

export interface GetDialogsResponse {
  userID: string
  dialogs: Dialog[]
}

// SearchChats

export interface SearchChatsOptions {
  userID: string
  value: string
}

export interface SearchChatsResponse {
  userID: string
  chats: (DialogChat | GroupChat)[]
  users: User[]
}

// CreateDialog

export interface CreateDialogOptions {
  userID: string
  comradeID: string
}

export interface CreateDialogResponse {
  userID: string
  dialog: Dialog
}

// CreateGroup

export interface CreateGroupOptions {
  creatorID: string
  name: string
  image: string
  roster: { userID: string }[]
}

export interface CreateGroupResponse {
  userID: string
  group: Group
}

//  HandleUserDialogActive

export interface HandleUserDialogOptions {
  dialogID: string
}
export type HandleUserDialogResponse = void