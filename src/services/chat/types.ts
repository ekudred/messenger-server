import { Message } from '../message/types'
import { User } from '../user/types'

export type ChatType = 'dialog' | 'group' | 'user'

export interface Dialog {
  id: string
  companion: User
  roster: User[]
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export interface DialogChat {
  type: 'dialog',
  chat: Dialog
}

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

export interface UserChat {
  type: 'user',
  chat: User
}

// GetChat

export interface GetChatOptions {
  type: ChatType
  id: string
  userID: string
}

export type GetChatResponse = DialogChat | GroupChat | UserChat

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
  chats: (DialogChat | GroupChat | UserChat)[]
}

// CreateDialog

export interface CreateDialogOptions {
  userID: string
  companionID: string
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