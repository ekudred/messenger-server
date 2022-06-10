import { DialogChat, GroupChat } from '../chat/types'
import { Dialog } from '../dialog/types'
import { Group } from '../group/types'

export interface Folder {
  id: string
  name: string
  userID: string
  roster: (DialogChat | GroupChat)[]
  createdAt: Date
  updatedAt: Date
}

// CreateFolder

export interface CreateFolderOptions {
  userID: string
  name: string
  dialogs: { id: string }[]
  groups: { id: string }[]
}

export interface CreateFolderResponse {
  folder: Folder
}

// EditFolder

export interface EditFolderOptions {
  folderID: string
  folderName: string
  roster: {
    deleted: { dialogs: { id: string }[]; groups: { id: string }[] }
    added: { dialogs: { id: string }[]; groups: { id: string }[] }
  }
}

export interface EditFolderResponse {
  folder: Folder
}

// SearchChats

export interface SearchFolderChatsOptions {
  userID: string
  folderID: string
  value: string
}

export interface SearchFolderChatsResponse {
  chats: (DialogChat | GroupChat)[]
}

// DeleteFolder

export interface DeleteFolderOptions {
  folderID: string
  folderName: string
}

export interface DeleteFolderResponse {
  folderID: string,
  folderName: string
}

// SearchFolderDialogs

export interface SearchFolderDialogsOptions {
  userID: string
  folderID: string
  value: string
}

export type SearchFolderDialogsResponse = Dialog[]

// FindFolderGroups

export interface SearchFolderGroupsOptions {
  folderID: string
  value: string
}

export type SearchFolderGroupsResponse = Group[]

// FindFolder

export interface FindFolderOptions {
  id: string
}

export type FindFolderResponse = Folder

// FindFolders

export interface FindFoldersOptions {
  userID: string
}

export type FindFoldersResponse = Folder[]