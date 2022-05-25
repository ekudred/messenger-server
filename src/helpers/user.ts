import { User } from '../services/user/types'
import UserModel from '../database/models/user.model'

class TransformedUser implements User {
  public id: string
  public username: string
  public fullname: string
  public birthdate: string
  public avatar: string
  public role: string
  public isActivated: boolean
  public createdAt: Date
  public updatedAt: Date

  constructor(model: UserModel) {
    this.id = model.id
    this.username = model.username
    this.fullname = model.fullname
    this.birthdate = model.birthdate
    this.avatar = model.avatar
    this.role = model.role
    this.isActivated = model.is_activated
    this.createdAt = model.created_at
    this.updatedAt = model.updated_at
  }

  public toPlainObj(): Object {
    return Object.assign({}, this)
  }
}

export default TransformedUser