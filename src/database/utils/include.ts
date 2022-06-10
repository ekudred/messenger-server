import { Includeable, WhereOptions } from 'sequelize'

import Dialog from '../models/dialog.model'
import DialogRoster from '../models/dialog-roster.model'
import DialogMessage from '../models/dialog-message.model'
import DialogLastMessage from '../models/dialog-last-message.model'
import DialogMessageUnread from '../models/dialog-message-unread.model'
import Group from '../models/group.model'
import GroupRoster from '../models/group-roster.model'
import GroupMessage from '../models/group-message.model'
import GroupLastMessage from '../models/group-last-message.model'
import GroupMessageUnread from '../models/group-message-unread.model'
import Folder from '../models/folder.model'
import FolderDialogRoster from '../models/folder-dialog-roster.model'
import FolderGroupRoster from '../models/folder-group-roster.model'
import User from '../models/user.model'

import { userSafeAttributes } from './constants'


interface IncludeOptions {
  as: string
  options?: {
    where: WhereOptions
  }
  include: Includeable[]
}

// Dialog

export function includeDialog({ as, options, include }: IncludeOptions): Includeable {
  return { model: Dialog, as, include, ...options }
}

export function includeDialogMessage({ as, options, include }: IncludeOptions): Includeable {
  return { model: DialogMessage, as, ...options, include }
}

export function includeDialogLastMessage({ as, options, include }: IncludeOptions): Includeable {
  return { model: DialogLastMessage, as, ...options, include }
}

export function includeDialogMessageUnread({ as, options, include }: IncludeOptions): Includeable {
  return { model: DialogMessageUnread, as, ...options, include }
}

export function includeDialogRoster({ as, options, include }: IncludeOptions): Includeable {
  return { model: DialogRoster, as, ...options, include }
}

// Group

export function includeGroup({ as, options, include }: IncludeOptions): Includeable {
  return { model: Group, as, ...options, include }
}

export function includeGroupChat({ as, options, include }: IncludeOptions): Includeable {
  return { model: Group, as, ...options, include }
}

export function includeGroupMessage({ as, options, include }: IncludeOptions): Includeable {
  return { model: GroupMessage, as, ...options, include }
}

export function includeGroupLastMessage({ as, options, include }: IncludeOptions): Includeable {
  return { model: GroupLastMessage, as, ...options, include }
}

export function includeGroupMessageUnread({ as, options, include }: IncludeOptions): Includeable {
  return { model: GroupMessageUnread, as, ...options, include }
}

export function includeGroupRoster({ as, options, include }: IncludeOptions): Includeable {
  return { model: GroupRoster, as, ...options, include }
}

// Folder

export function includeFolder({ as, options, include }: IncludeOptions): Includeable {
  return { model: Folder, as, ...options, include }
}

export function includeFolderDialogRoster({ as, options, include }: IncludeOptions): Includeable {
  return { model: FolderDialogRoster, as, ...options, include }
}

export function includeFolderGroupRoster({ as, options, include }: IncludeOptions): Includeable {
  return { model: FolderGroupRoster, as, ...options, include }
}

// User

export function includeUser(as: string = 'user'): Includeable {
  return { model: User, as, attributes: userSafeAttributes }
}