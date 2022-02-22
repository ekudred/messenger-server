const socket = require('socket.io')
import { Server as HTTPServer } from 'http'

class Socket {
  public io: any

  constructor(server: HTTPServer) {
    this.io = socket(server, { cors: { credentials: true, origin: process.env.CLIENT_URL } })
  }

  public connect() {
    this.io.on('connection', (socket: any) => {
      socket.on('disconnect', () => {
        console.log(socket.id, 'disconnect')
      })
    })
  }
}

export default Socket
