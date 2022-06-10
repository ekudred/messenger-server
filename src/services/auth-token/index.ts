import TokenService from '../token'
import DataBase from '../../database'

class AuthTokenService extends TokenService {
  static async createToken(checkTokenFilter: object, refreshToken: string, clientID: string, doc: any) {
    const data = await DataBase.models.AuthToken.findOne({ where: checkTokenFilter })

    if (data) {
      data.refresh_token = refreshToken
      data.client_id = clientID
      await data.save()

      return null
    }

    const token = await DataBase.models.AuthToken.create(doc)

    return token
  }

  static async findToken(where: object) {
    return await DataBase.models.AuthToken.findOne({ where })
  }

  static async updateToken(update: object, where: object) {
    await DataBase.models.AuthToken.update(update, { where })
  }

  static async deleteToken(where: object) {
    return await DataBase.models.AuthToken.destroy({ where })
  }
}

export default AuthTokenService
