export interface GetChatsDTO {
  userID: string
}

export interface GetDialogsDTO {
  userID: string
}

export interface SearchChatsDTO {
  userID: string
  value: string
}

export interface CreateDialogDTO {
  userID: string
  companionID: string
}

export interface CreateGroupDTO {
  creatorID: string
  name: string
  image: string
  roster: { userID: string }[]
}
