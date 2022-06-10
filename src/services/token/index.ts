import JWT from 'jsonwebtoken'

import { expiresInOptions } from './types'

class TokenService {
  static generateTokens(payload: string | object | Buffer, expiresIn: expiresInOptions) {
    const accessToken = JWT.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: expiresIn.accessToken })
    const refreshToken = JWT.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: expiresIn.refreshToken })

    return { accessToken, refreshToken }
  }

  static verifyAccessToken(accessToken: string) {
    try {
      const data: any = JWT.verify(accessToken, process.env.JWT_ACCESS_SECRET!)

      return data
    } catch (e) {
      return null
    }
  }

  static verifyRefreshToken(refreshToken: string) {
    try {
      const data: any = JWT.verify(refreshToken, process.env.JWT_REFRESH_SECRET!)

      return data
    } catch (e) {
      return null
    }
  }
}

export default TokenService
