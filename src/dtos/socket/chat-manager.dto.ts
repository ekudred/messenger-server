import { GetChatsOptions, SearchChatsOptions } from '../../services/chat/types'
import { FindDialogsOptions, SearchDialogsOptions } from '../../services/dialog/types'
import { CreateGroupOptions } from '../../services/group/types'

export interface GetChatsDTO extends GetChatsOptions {
}

export interface GetDialogsDTO extends FindDialogsOptions {
}

export interface SearchChatsDTO extends SearchChatsOptions {
}

export interface SearchDialogsDTO extends SearchDialogsOptions {
}

export interface CreateGroupDTO extends CreateGroupOptions {
}
