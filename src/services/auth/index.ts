const bcrypt = require('bcrypt')

import ErrorAPI from '../../exceptions/ErrorAPI'
import AuthTokenService from '../auth-token'
import UserService from '../user'
import MailService from '../mail'
import DataBase from '../../database'
import User from '../../helpers/user'
import {
  SignUpOptions,
  SignInOptions,
  SignOutOptions,
  RefreshOptions,
  ActiveOptions,
  ConfirmUserOptions
} from './types'
import { getActivationMailOptions } from '../../utils/mail-options'

class AuthService {
  static async signUp(options: SignUpOptions) {
    const { user } = await UserService.createUser(options)

    const mailOptions = getActivationMailOptions({
      to: user.email,
      link: `${process.env.SERVER_URL}/api/auth/activate/${user.activation_link}`
    })
    const mail = new MailService()
    await mail.sendMail({ ...mailOptions })

    const message = 'An email has been sent to this email address to activate your account'

    return { message }
  }

  static async signIn(options: SignInOptions) {
    const { username, password, clientID } = options

    const user = await DataBase.models.User.findOne({ where: { username } })
    if (!user) throw ErrorAPI.unAuthError('User is not found')

    const isPass = await bcrypt.compare(password, user.password)
    if (!isPass) throw ErrorAPI.badRequest('Invalid password')

    const isActivated = user.is_activated
    if (!isActivated) throw ErrorAPI.badRequest('Email not verified')

    const transformedUser = new User(user)
    const tokens = AuthTokenService.generateTokens(transformedUser.toPlainObj(), {
      accessToken: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN!,
      refreshToken: process.env.AUTH_ACCESS_TOKEN_EXPIRES_IN!
    })
    await AuthTokenService.createToken({ user_id: transformedUser.id, client_id: clientID }, tokens.refreshToken, clientID, {
      user_id: transformedUser.id, refresh_token: tokens.refreshToken, client_id: clientID
    })

    return { ...tokens, user: transformedUser }
  }

  static async signOut(options: SignOutOptions) {
    return await AuthTokenService.deleteToken({ refresh_token: options.refreshToken })
  }

  static async refresh(options: RefreshOptions) {
    const { refreshToken, clientID } = options
    if (!refreshToken || !clientID) throw ErrorAPI.unAuthError()

    const userData: any = AuthTokenService.verifyRefreshToken(refreshToken)
    const tokenFromDB = await AuthTokenService.findToken({ refresh_token: refreshToken, client_id: clientID })

    if (!userData || !tokenFromDB) throw ErrorAPI.unAuthError()

    const user = await DataBase.models.User.findOne({ where: { id: userData.id } })
    const transformedUser = new User(user)

    const tokens = AuthTokenService.generateTokens(transformedUser.toPlainObj(), {
      accessToken: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN!,
      refreshToken: process.env.AUTH_ACCESS_TOKEN_EXPIRES_IN!
    })
    tokenFromDB.refresh_token = tokens.refreshToken
    tokenFromDB.save()

    return { ...tokens, user: transformedUser }
  }

  static async activate(options: ActiveOptions) {
    const user = await DataBase.models.User.findOne({ where: { activation_link: options.activationLink } })
    if (!user) throw ErrorAPI.badRequest('Invalid activation link')

    user.is_activated = true
    user.save()
  }

  static async confirmUser(options: ConfirmUserOptions) {
    const { id, password } = options

    const user = await DataBase.models.User.findOne({ where: { id } })
    const isPass = await bcrypt.compare(password, user.password)

    return { isConfirm: isPass, user: { email: user.email, phone: user.phone } }
  }
}

export default AuthService
