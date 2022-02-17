import express, { Express } from 'express'
import http, { Server } from 'http'
// import path from 'path'
// const uuid = require('uuid')
// const cookieParser = require('cookie-parser')
// import bodyParser from 'body-parser'
// import cors from 'cors'

import DataBase from './database'
import Router from './Router'
import Socket from './Socket'

class App {
  private server: Server
  private app: Express
  private database: DataBase
  private router: Router
  private socket: Socket

  constructor() {
    this.app = express()
    this.server = http.createServer(this.app)

    this.router = new Router(this.app)
    this.database = new DataBase()
    this.socket = new Socket(this.server)

    this.database.connect()
    this.socket.connect()
  }

  // private plugins() {
  // this.app.use(cors({ credentials: true, origin: process.env.CLIENT_URL })) ?? because of the routing controllers
  // this.app.use(cookieParser())
  // this.app.use(bodyParser.json())
  // }

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
