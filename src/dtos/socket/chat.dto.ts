import { GetChatOptions } from '../../services/chat/types'
import { ChatType } from '../../services/chat/types'
import { SendMessageOptions } from '../../services/message/types'

export interface JoinChatDTO extends GetChatOptions {
}

export interface LeaveChatDTO {
  type: ChatType
  id: string
}

export interface SendMessageDTO extends SendMessageOptions {
  chatType: ChatType
}
