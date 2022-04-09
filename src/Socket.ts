import { useSocketServer } from 'socket-controllers'
import { Server as HTTPServer } from 'http'
import chalk from 'chalk'

class Socket {
  public static create(server: HTTPServer) {
    const io = require('socket.io')(server, { cors: { origin: process.env.CLIENT_URL, credentials: true } })

    useSocketServer(io, {
      controllers: [__dirname + '/socket-controllers/**/*.socket-controller.ts'],
      middlewares: [__dirname + '/middlewares/socket-controllers/auth.middleware.ts'],
    })

    console.log(chalk.magenta('Socket.io'), chalk.green('is up and running'))
  }
}

export default Socket
