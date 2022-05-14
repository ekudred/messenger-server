import { Socket } from 'socket.io'

import ErrorAPI from '../../exceptions/ErrorAPI'
import { emitError, EmitErrorOptions } from '../../utils/custom-socket-middleware'
import TokenService from '../../services/token'

interface AuthSocketMiddlewareOptions {
  permittedRoles: string[]
  emitAtError: EmitErrorOptions
}

export function authSocketMiddleware(options: AuthSocketMiddlewareOptions) {
  return (socket: Socket) => {
    const { permittedRoles, emitAtError: emitAtErrorOptions } = options

    const accessToken = socket.handshake.auth.accessToken
    if (!accessToken) throw emitError(socket, ErrorAPI.unAuthError(), emitAtErrorOptions)

    const user: any = TokenService.verifyAccessToken(accessToken)
    if (!user) throw emitError(socket, ErrorAPI.unAuthError(), emitAtErrorOptions)

    if (!permittedRoles.includes(user.role)) throw emitError(socket, ErrorAPI.forbidden(), emitAtErrorOptions)

    socket.handshake.auth.user = user

    const userRoom = `user_room=${user.id}`
    if (!socket.rooms.has(userRoom)) socket.join(userRoom)

    return socket
  }
}
