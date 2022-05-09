import {
  CreateFolderOptions,
  EditFolderOptions,
  GetFoldersOptions,
  DeleteFolderOptions
} from '../../services/folder/types'
import { GetChatsOptions } from '../../services/chat/types'

export interface CreateFolderDTO extends CreateFolderOptions {
}

export interface EditFolderDTO extends EditFolderOptions {
}

export interface GetFoldersDTO extends GetFoldersOptions {
}

export interface DeleteFolderDTO extends DeleteFolderOptions {
}

export interface GetChatsDTO extends GetChatsOptions {
}
