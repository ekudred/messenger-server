import { User } from '../services/user/types'

class TransformedUser implements User {
  public id: string
  public username: string
  public fullname: string
  public birthdate: string
  public avatar: string
  public role: string
  public isActivated: boolean
  public createdAt: string
  public updatedAt: string

  constructor(object: { [key: string]: any }) {
    this.id = object.id
    this.username = object.username
    this.fullname = object.fullname
    this.birthdate = object.birthdate
    this.avatar = object.avatar
    this.role = object.role
    this.isActivated = object.is_activated
    this.createdAt = object.createdAt
    this.updatedAt = object.updatedAt
  }

  public toPlainObj(): Object {
    return Object.assign({}, this)
  }
}

export default TransformedUser