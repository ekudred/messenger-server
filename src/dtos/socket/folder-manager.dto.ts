import {
  CreateFolderOptions,
  EditFolderOptions,
  FindFoldersOptions,
  DeleteFolderOptions
} from '../../services/folder/types'
import { SearchFolderChatsOptions } from '../../services/folder/types'

export interface CreateFolderDTO extends CreateFolderOptions {
}

export interface EditFolderDTO extends EditFolderOptions {
}

export interface GetFoldersDTO extends FindFoldersOptions {
}

export interface DeleteFolderDTO extends DeleteFolderOptions {
}

export interface SearchFolderChatsDTO extends SearchFolderChatsOptions {
}
