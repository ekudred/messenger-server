const bcrypt = require('bcrypt')
const uuid = require('uuid')

import ErrorAPI from '../exceptions/ErrorAPI'
import AuthTokenService from './auth-token.service'
import UserService from './user.service'
import MailService from './mail.service'
import { UserDTO } from '../dtos/user.dto'
import { SignInDTO, SignUpDTO, RefreshDTO } from '../dtos/auth.dto'
import { getActivationMailOptions } from '../utils/send-mail-options'

interface SignUpOptions extends SignUpDTO {}
interface SignInOptions extends SignInDTO {}
interface SignOutOptions {
  refreshToken: string
}
interface RefreshOptions extends RefreshDTO {
  refreshToken: string
}
interface ActiveOptions {
  activationLink: string
}

class AuthService {
  public static async signUp(options: SignUpOptions) {
    const user = await UserService.create(options)

    const mailOptions = getActivationMailOptions({ to: user.email, link: `${process.env.DOMAIN}/api/auth/activate/${user.activation_link}` })
    const mail = new MailService()
    await mail.send({ ...mailOptions })

    const message = 'An email has been sent to this email address to activate your account'

    return { message }
  }

  public static async signIn(options: SignInOptions) {
    const { username, password, clientID } = options

    const user = await UserService.find({ username })
    if (!user) throw ErrorAPI.unAuthError('User is not found')

    const isPass = await bcrypt.compare(password, user.password)
    if (!isPass) throw ErrorAPI.badRequest('Invalid password')

    const isActivated = user.is_activated
    if (!isActivated) throw ErrorAPI.badRequest('Email not verified')

    const userDTO = new UserDTO(user)
    const tokens = AuthTokenService.generateTokens(userDTO.toPlainObj())
    await AuthTokenService.create({ user_id: userDTO.id, client_id: clientID }, tokens.refreshToken, clientID, {
      id: uuid.v4(),
      user_id: userDTO.id,
      refresh_token: tokens.refreshToken,
      client_id: clientID,
    })

    return { ...tokens, user: userDTO }
  }

  public static async signOut(options: SignOutOptions) {
    return await AuthTokenService.delete({ refresh_token: options.refreshToken })
  }

  public static async refresh(options: RefreshOptions) {
    const { refreshToken, clientID } = options
    if (!refreshToken || !clientID) throw ErrorAPI.unAuthError()

    const userData: any = AuthTokenService.verifyRefreshToken(refreshToken)
    const tokenFromDB = await AuthTokenService.find({ refresh_token: refreshToken, client_id: clientID })

    if (!userData || !tokenFromDB) throw ErrorAPI.unAuthError()

    const user = await UserService.find({ id: userData.id })
    const userDTO = new UserDTO(user)

    const tokens = AuthTokenService.generateTokens(userDTO.toPlainObj())
    tokenFromDB.refresh_token = tokens.refreshToken
    tokenFromDB.save()

    return { ...tokens, user: userDTO }
  }

  public static async activate(options: ActiveOptions) {
    const user = await UserService.find({ activation_link: options.activationLink })
    if (!user) throw ErrorAPI.badRequest('Invalid activation link')

    user.is_activated = true
    user.save()
  }
}

export default AuthService
