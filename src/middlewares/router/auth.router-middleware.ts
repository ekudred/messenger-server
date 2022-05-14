import { Request, Response, NextFunction } from 'express'

import ErrorAPI from '../../exceptions/ErrorAPI'
import TokenService from '../../services/token'

export function authRouterMiddleware(permittedRoles: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (request.method === 'OPTIONS') {
      next()
    }
    
    try {
      const authHeader = request.headers.authorization
      if (!authHeader) return next(ErrorAPI.unAuthError())

      const accessToken = authHeader.split(' ')[1]
      if (!accessToken) return next(ErrorAPI.unAuthError())

      const user: any = TokenService.verifyAccessToken(accessToken)
      if (!user) return next(ErrorAPI.unAuthError())

      if (!permittedRoles.includes(user.role)) next(ErrorAPI.forbidden())

      request.body = { user }

      next()
    } catch (error: any) {
      return next(ErrorAPI.unAuthError(error))
    }
  }
}
