const socket = require('socket.io')
// import * as socket from 'socket.io'
import { Server } from 'http'

class Socket {
  private io

  constructor(server: Server) {
    this.io = socket(server, { cors: { credentials: true, origin: process.env.CLIENT_URL } })
  }

  private plugins() {}

  public connect() {
    this.io.on('connection', (socket: any) => {
      socket.on('disconnect', () => {
        console.log(socket.id, 'disconnect')
      })
    })
  }
}

export default Socket
