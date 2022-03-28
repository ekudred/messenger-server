import { Request, Response, NextFunction } from 'express'

import ErrorAPI from '../exceptions/ErrorAPI'
import TokenService from '../services/internal/token.service'

function authMiddleware(permittedRoles: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') {
      next()
    }

    try {
      const authHeader = req.headers.authorization
      if (!authHeader) return next(ErrorAPI.unAuthError())

      const accessToken = authHeader.split(' ')[1]
      if (!accessToken) return next(ErrorAPI.unAuthError())

      const user: any = TokenService.verifyAccessToken(accessToken)
      if (!user) return next(ErrorAPI.unAuthError())

      if (!permittedRoles.includes(user.role)) next(ErrorAPI.forbidden())

      req.body = { user }

      next()
    } catch (e) {
      return next(ErrorAPI.unAuthError())
    }
  }
}

export default authMiddleware
