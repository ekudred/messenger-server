import { Middleware, MiddlewareInterface } from 'socket-controllers'
import TokenService from '../../services/internal/token.service'

@Middleware()
export class AuthSocketMiddleware implements MiddlewareInterface {
  use(socket: any, next: (err?: any) => any) {
    try {
      if (socket.handshake.auth && socket.handshake.auth.accessToken) {
        const user = TokenService.verifyAccessToken(socket.handshake.auth.accessToken)

        if (!socket.rooms.has(user.id)) {
          socket.join(user.id)
        }

        socket.handshake.auth.user = user
      }
      
      next()
    } catch (error: any) {
      next(error)
    }
  }
}
