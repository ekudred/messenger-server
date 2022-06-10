import { User } from '../user/types'
import { Message } from '../message/types'

export interface Group {
  id: string
  name: string
  avatar: string
  creator: User
  roster: User[]
  messages: Message[]
  lastMessage: Message | null
  unreadMessages: Message[] | null
  createdAt: Date
  updatedAt: Date
}

// CreateGroup

export interface CreateGroupOptions {
  creatorID: string
  name: string
  image: string
  roster: { userID: string }[]
}

export type CreateGroupResponse = Group

// FindGroups

export interface FindGroupsOptions {
  userID: string
}

export type FindGroupsResponse = Group[]

// FindGroup

export interface FindGroupOptions {
  id: string
}

export type FindGroupResponse = Group

// SearchGroups

export interface SearchGroupsOptions {
  userID: string
  value: string
}

export type SearchGroupsResponse = Group[]