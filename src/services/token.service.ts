import JWT from 'jsonwebtoken'

interface expiresInOptions {
  accessToken: string
  refreshToken: string
}

class TokenService {
  public static generateTokens(payload: string | object | Buffer, expiresIn: expiresInOptions) {
    const accessToken = JWT.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: expiresIn.accessToken })
    const refreshToken = JWT.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: expiresIn.refreshToken })

    return { accessToken, refreshToken }
  }

  public static verifyAccessToken(accessToken: string) {
    try {
      const data = JWT.verify(accessToken, process.env.JWT_ACCESS_SECRET!)

      return data
    } catch (e) {
      return null
    }
  }

  public static verifyRefreshToken(refreshToken: string) {
    try {
      const data = JWT.verify(refreshToken, process.env.JWT_REFRESH_SECRET!)

      return data
    } catch (e) {
      return null
    }
  }
}

export default TokenService
