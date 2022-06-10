import { DialogChat, GroupChat } from '../services/chat/types'

export const sortChats = (chats: (DialogChat | GroupChat)[]): (DialogChat | GroupChat)[] => {
  return chats.sort((a, b) => {
    return (
      (a.chat.lastMessage ? a.chat.lastMessage.createdAt : a.chat.createdAt)
      > (b.chat.lastMessage ? b.chat.lastMessage.createdAt : b.chat.createdAt)
    )
      ? -1
      : (
        (a.chat.lastMessage ? a.chat.lastMessage.createdAt : a.chat.createdAt)
        < (b.chat.lastMessage ? b.chat.lastMessage.createdAt : b.chat.createdAt)
      )
        ? 1
        : 0
  })
}