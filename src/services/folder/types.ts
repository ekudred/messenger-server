import { Dialog, Group } from '../chat/types'

export interface Folder {
  id: string
  name: string
  userID: string
  roster: (Dialog | Group)[]
  createdAt: string
  updatedAt: string
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

// GetFolders

export interface GetFoldersOptions {
  userID: string
}

export interface GetFoldersResponse {
  folders: Folder[]
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