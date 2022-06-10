import { User } from '../user/types'
import { Message } from '../message/types'

export interface Dialog {
  id: string
  roster: User[]
  messages: Message[]
  lastMessage: Message | null
  unreadMessages: Message[] | null
  createdAt: Date
  updatedAt: Date
}

// CreateDialog

export interface CreateDialogOptions {
  userID: string
  comradeID: string
}

export type CreateDialogResponse = Dialog

// FindDialogs

export interface FindDialogsOptions {
  userID: string
  comradeID?: string | string[]
  active: boolean
}

export type FindDialogsResponse = Dialog[]

// FindDialog

export interface FindDialogOptions {
  dialogID: string
  active: boolean
}

export type FindDialogResponse = Dialog | null

// SearchDialogs

export interface SearchDialogsOptions {
  userID: string
  value: string
}

export type SearchDialogsResponse = Dialog[]

// HandleDialog

export interface HandleDialogOptions {
  id: string
}

export interface HandleDialogResponse {
  created: boolean
}