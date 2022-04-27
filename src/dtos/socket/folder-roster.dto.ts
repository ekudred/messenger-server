export interface CreateFolderDTO {
  userID: string
  name: string
  dialogs: { id: string }[]
  groups: { id: string }[]
}

export interface EditFolderDTO {
  folderID: string
  folderName: string
  roster: {
    deleted: { dialogs: { id: string }[]; groups: { id: string }[] }
    added: { dialogs: { id: string }[]; groups: { id: string }[] }
  }
}

export interface GetFoldersDTO {
  userID: string
}

export interface DeleteFolderDTO {
  folderID: string
  folderName: string
}
