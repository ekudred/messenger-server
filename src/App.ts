import express, { Application } from 'express'
import { Server as HTTPServer } from 'http'

import Server from './server'
import Router from './router'
import Socket from './socket'
import DataBase from './database'

class App {
  private app: Application
  private server: HTTPServer
  private router: Router
  private socket: Socket
  private database: DataBase

  constructor() {
    this.app = express()

    this.server = Server.create(this.app)
    this.router = Router.create(this.app)
    this.socket = new Socket(this.server)
    this.database = new DataBase()

    this.socket.connect()
    this.database.connect()
  }

  public start() {
    try {
      this.server.listen(process.env.PORT, () => console.log(`Server has been started on port ${process.env.PORT}`))
    } catch (error) {
      console.log(error)
      process.exit(1)
    }
  }
}

export default App
