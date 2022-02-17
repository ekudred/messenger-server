const bcrypt = require('bcrypt')
const uuid = require('uuid')
import { Op } from 'sequelize'

import ErrorAPI from '../exceptions/ErrorAPI'
import AuthTokenService from './auth-token.service'
import DataBase from '../database'
import { SignUpDTO } from '../dtos/auth.dto'
import { ConfirmDTO, DeleteDTO, UpdateDTO } from '../dtos/profile.dto'

interface CreateOptions extends SignUpDTO {}
interface UpdateOptions extends UpdateDTO {
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

  public static async update(update: UpdateOptions, filter: object) {
    const user = await DataBase.models.User.findOne({ where: filter })

    for (const field in update) {
      if (field === 'password') {
        const isPass = await bcrypt.compare(update[field], user.password)
        if (!isPass) {
          user.password = await bcrypt.hash(update[field], 3)
        }
        continue
      }

      if (field === 'avatar') {
        // update avatar
        continue
      }

      if (user[field] !== update[field]) {
        user[field] = update[field]
      }
    }

    user.save()
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

    return isPass
  }
}

export default UserService
