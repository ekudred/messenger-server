import TokenService from './token.service'
import DataBase from '../database'

class AuthTokenService extends TokenService {
  public static async create(checkTokenFilter: object, refreshToken: string, clientID: string, doc: any) {
    const data = await DataBase.models.Token.findOne({ where: checkTokenFilter })

    if (data) {
      data.refresh_token = refreshToken
      data.client_id = clientID
      await data.save()

      return null
    }

    const token = await DataBase.models.Token.create(doc)

    return token
  }

  public static async find(filter: object) {
    return await DataBase.models.Token.findOne({ where: filter })
  }

  public static async update(update: object, filter: object) {
    await DataBase.models.Token.update(update, { where: filter })
  }

  public static async delete(filter: object) {
    return await DataBase.models.Token.destroy({ where: filter })
  }
}

export default AuthTokenService
