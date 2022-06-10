const bcrypt = require('bcrypt')
const uuid = require('uuid')
import { Op } from 'sequelize'

import DataBase from '../../database'
import ErrorAPI from '../../exceptions/ErrorAPI'
import AuthTokenService from '../auth-token'
import Storage from '../../storage'
import {
  CreateUserOptions,
  UpdateUserOptions,
  SearchUsersOptions,
  SearchUsersResponse,
  DeleteUserOptions
} from './types'
import TransformedUser from '../../helpers/user'

class UserService {
  static async createUser(options: CreateUserOptions) {
    const { email, username, password } = options

    const checkUser = await DataBase.models.User.findOne({ where: { [Op.or]: [{ email }, { username }] } })
    if (checkUser) throw ErrorAPI.badRequest('This user already exists')

    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = uuid.v4()
    const id = uuid.v4()

    const user = await DataBase.models.User.create({
      id, password: hashPassword, email, username, activation_link: activationLink
    })

    return { user }
  }

  static async findUser(where: object) {
    const user = await DataBase.models.User.findOne({ where })

    return { user: new TransformedUser(user) }
  }

  static async findAllUsers() {
    const users = await DataBase.models.User.findAll()

    return { users }
  }

  static async searchUsers(options: SearchUsersOptions): Promise<SearchUsersResponse> {
    const { userID, value } = options

    const users = await DataBase.models.User.scope(['safe']).findAll({
      where: {
        id: { [Op.not]: userID },
        username: { [Op.like]: `%${value}%` }
      },
      order: [['created_at', 'DESC']]
    })

    return users.map((user: any) => new TransformedUser(user))
  }

  static async editUser(update: UpdateUserOptions, where: object) {
    const user = await DataBase.models.User.findOne({ where })

    Object.entries(update).map(async ([field, value]) => {
      if (!value) return

      if (field === 'password') {
        const password: string = value

        const isPass = await bcrypt.compare(password, user.password)
        if (isPass) throw ErrorAPI.badRequest('Password must not be repeated')

        const hashPassword = await bcrypt.hash(password, 3)
        user.password = hashPassword

        return
      }
      if (field === 'avatar') {
        const base64String: string = value

        if (base64String.includes('data:image')) {
          const body = Buffer.from(base64String.replace(/^data:image\/\w+;base64,/, ''), 'base64')
          const contentType = base64String.split(';')[0].split('/')[1]

          const options = {
            path: `user_avatars/user_avatar_${user.id}`,
            body,
            contentEncoding: 'base64',
            contentType: `image/${contentType}`
          }

          const storage = new Storage()
          const data = await storage.upload(options)

          user.avatar = data.Location
        }

        return
      }

      if (value !== user[field]) {
        user[field] = value
      }
    })

    user.save()

    return { user: new TransformedUser(user) }
  }

  static async deleteUser(options: DeleteUserOptions) {
    await AuthTokenService.deleteToken({ user_id: options.id })

    await DataBase.models.User.destroy({ where: { id: options.id } })
  }
}

export default UserService
