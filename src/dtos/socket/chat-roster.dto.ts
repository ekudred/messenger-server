import {
  CreateDialogOptions,
  CreateGroupOptions,
  GetChatsOptions,
  GetDialogsOptions,
  SearchChatsOptions
} from '../../services/chat/types'

export interface GetChatsDTO extends GetChatsOptions {
}

export interface GetDialogsDTO extends GetDialogsOptions {
}

export interface SearchChatsDTO extends SearchChatsOptions {
}

export interface CreateDialogDTO extends CreateDialogOptions {
}

export interface CreateGroupDTO extends CreateGroupOptions {

}
