import JWT from 'jsonwebtoken'

class TokenService {
  public static generateTokens(payload: string | object | Buffer) {
    const accessToken = JWT.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN! })
    const refreshToken = JWT.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN! })

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
