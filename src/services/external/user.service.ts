const bcrypt = require('bcrypt')
const uuid = require('uuid')
import { Op } from 'sequelize'

import ErrorAPI from '../../exceptions/ErrorAPI'
import AuthTokenService from './auth-token.service'
import DataBase from '../../database'
import Storage from '../../storage'

import { UserDTO } from '../../dtos/user.dto'
import { SignUpDTO } from '../../dtos/auth.dto'
import { ConfirmDTO, DeleteDTO, EditDTO } from '../../dtos/profile.dto'

interface CreateOptions extends SignUpDTO {}
interface UpdateOptions extends EditDTO {
  [key: string]: any
}
interface DeleteOptions extends DeleteDTO {}
interface ConfirmOptions extends ConfirmDTO {}

class UserService {
  public static async create(options: CreateOptions) {
    const { email, username, password } = options

    const checkUser = await DataBase.models.User.findOne({ where: { [Op.or]: [{ email }, { username }] } })
    if (checkUser) throw ErrorAPI.badRequest('This user already exists')

    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = uuid.v4()
    const id = uuid.v4()

    const user = await DataBase.models.User.create({
      id,
      password: hashPassword,
      email,
      username,
      activation_link: activationLink,
    })

    return user
  }

  public static async find(filter: object) {
    return await DataBase.models.User.findOne({ where: filter })
  }

  public static async findAll() {
    return await DataBase.models.User.findAll()
  }

  public static async edit(update: UpdateOptions, filter: object) {
    const user = await DataBase.models.User.findOne({ where: filter })

    for (const field in update) {
      const value = update[field]

      if (!value) continue

      if (field === 'password') {
        const password: string = value

        const isPass = await bcrypt.compare(password, user.password)
        if (isPass) throw ErrorAPI.badRequest('Password must not be repeated')

        const hashPassword = await bcrypt.hash(password, 3)
        user.password = hashPassword

        continue
      }

      if (field === 'avatar') {
        const base64String: string = value

        if (base64String.includes('data:image')) {
          const body = Buffer.from(base64String.replace(/^data:image\/\w+;base64,/, ''), 'base64')
          const contentType = base64String.split(';')[0].split('/')[1]

          const options = {
            path: `avatars/avatar${user.id}`,
            body,
            contentEncoding: 'base64',
            contentType: `image/${contentType}`,
          }

          const storage = new Storage()
          const data = await storage.upload(options)

          user.avatar = data.Location
        }

        continue
      }

      if (value !== user[field]) {
        user[field] = value
      }
    }

    user.save()

    return new UserDTO(user)
  }

  public static async delete(options: DeleteOptions) {
    await AuthTokenService.delete({ user_id: options.id })
    // delete chat-party by user
    // ???delete chats created by user???
    // delete folder-party by user
    // delete folders by user
    await DataBase.models.User.destroy({ where: { id: options.id } })
  }

  public static async confirm(options: ConfirmOptions) {
    const { id, password } = options

    const user = await DataBase.models.User.findOne({ where: { id } })
    const isPass = await bcrypt.compare(password, user.password)

    return { isConfirm: isPass, user: { email: user.email, phone: user.phone } }
  }
}

export default UserService
