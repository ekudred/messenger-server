import { Group } from '../services/chat/types'
import TransformedUser from './user'
import TransformedMessage from './message'
import GroupModel from '../database/models/group.model'

class TransformedGroup implements Group {
  public id: string
  public name: string
  public avatar: string
  public creator: TransformedUser
  public roster: TransformedUser[]
  public messages: TransformedMessage[]
  public createdAt: string
  public updatedAt: string

  constructor(model: GroupModel) {
    const messages = model.messages ?? []
    const roster = model.roster ?? []

    this.id = model.id
    this.name = model.name
    this.avatar = model.avatar
    this.creator = new TransformedUser(model.creator)
    this.roster = roster.map(groupRoster => new TransformedUser(groupRoster.user))
    this.messages = messages.map(groupMessage => new TransformedMessage({ chatType: 'group', chatID: model.id, model: groupMessage }))
    this.createdAt = model.createdAt
    this.updatedAt = model.updatedAt
  }
}

export default TransformedGroup