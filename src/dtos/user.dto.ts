export class UserDTO {
  public id: string
  public username: string
  public fullname: string
  public birthdate: string
  public avatar: string
  public role: string
  public isActivated: boolean

  constructor(object: { [key: string]: any }) {
    this.id = object.id
    this.username = object.username
    this.fullname = object.fullname
    this.birthdate = object.birthdate
    this.avatar = object.avatar
    this.role = object.role
    this.isActivated = object.is_activated
  }

  public toPlainObj(): Object {
    return Object.assign({}, this)
  }
}
