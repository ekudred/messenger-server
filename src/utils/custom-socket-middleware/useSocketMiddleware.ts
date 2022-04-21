import { Socket } from 'socket.io'

export type CustomSocketMiddleware = (socket: Socket) => Socket

export function useSocketMiddleware(socket: Socket, middlewares: CustomSocketMiddleware[]) {
  let usedSocket: Socket = socket

  for (const middleware of middlewares) {
    usedSocket = middleware(socket)
  }

  return usedSocket
}
