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
  createdAt: string
  updatedAt: string
}

export interface GroupChat {
  type: 'group',
  chat: Group
}

export interface Dialog {
  id: string
  comrade: User
  roster: User[]
  messages: Message[]
  createdAt: string
  updatedAt: string
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

export type GetChatResponse =  DialogChat | GroupChat

// GetChats

export interface GetChatsOptions {
  userID: string
}

export interface GetChatsResponse {
  chats: (DialogChat | GroupChat)[]
}

// GetDialogs

export interface GetDialogsOptions {
  userID: string
}

export interface GetDialogsResponse {
  dialogs: Dialog[]
}

// SearchChats

export interface SearchChatsOptions {
  userID: string
  value: string
}

export interface SearchChatsResponse {
  chats: (DialogChat | GroupChat)[]
  users: User[]
}

// CreateDialog

export interface CreateDialogOptions {
  userID: string
  comradeID: string
}

export interface CreateDialogResponse {
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
  group: Group
}

//  HandleUserDialogActive

export interface HandleUserDialogActiveOptions {
  dialogID: string
}
export interface HandleUserDialogActiveResponse {
  created: boolean
}