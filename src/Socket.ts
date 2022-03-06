import { useSocketServer } from 'socket-controllers'
import { Server as HTTPServer } from 'http'

class Socket {
  public static create(server: HTTPServer) {
    const io = require('socket.io')(server, { cors: { origin: process.env.CLIENT_URL, credentials: true } })

    useSocketServer(io, {
      controllers: [__dirname + '/socket-controllers/**/*.socket-controller.ts'],
      // middlewares: []
    })
  }
}

export default Socket
