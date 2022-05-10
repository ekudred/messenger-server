import TokenService from '../token'
import DataBase from '../../database'

class AuthTokenService extends TokenService {
  public static async createToken(checkTokenFilter: object, refreshToken: string, clientID: string, doc: any) {
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

  public static async findToken(where: object) {
    return await DataBase.models.AuthToken.findOne({ where })
  }

  public static async updateToken(update: object, where: object) {
    await DataBase.models.AuthToken.update(update, { where })
  }

  public static async deleteToken(where: object) {
    return await DataBase.models.AuthToken.destroy({ where })
  }
}

export default AuthTokenService
