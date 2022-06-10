import { Dialog } from '../dialog/types'
import { Group } from '../group/types'
import { User } from '../user/types'

export type ChatType = 'user' | 'group'

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

export type GetChatResponse =  (DialogChat | GroupChat) & { created: boolean }

// GetChats

export interface GetChatsOptions {
  userID: string
}

export interface GetChatsResponse {
  chats: (DialogChat | GroupChat)[]
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