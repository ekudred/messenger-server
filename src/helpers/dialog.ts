import { Dialog } from '../services/chat/types'
import TransformedUser from './user'
import TransformedMessage from './message'
import DialogModel from '../database/models/dialog.model'

class TransformedDialog implements Dialog {
  public id: string
  public comrade: TransformedUser
  public roster: TransformedUser[]
  public messages: TransformedMessage[]
  public createdAt: string
  public updatedAt: string

  constructor(model: DialogModel, userID: string) {
    const messages = model.messages ?? []
    const roster = model.roster ?? []

    this.id = model.id
    this.comrade = new TransformedUser(roster.find(dialogRoster => dialogRoster.user.id !== userID)!.user)
    this.roster = roster.map(model => new TransformedUser(model.user))
    this.messages = messages.map(dialogMessage => new TransformedMessage({ chatType: 'user', chatID: model.id, model: dialogMessage }))
    this.createdAt = model.createdAt
    this.updatedAt = model.updatedAt
  }
}

export default TransformedDialog