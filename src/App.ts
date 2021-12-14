import express, { Application } from 'express'
import http, { Server } from 'http'
const cookieParser = require('cookie-parser')
import bodyParser from 'body-parser'
import cors from 'cors'

import DataBase from './database'
import Router from './Router'
import Socket from './Socket'

class App {
  public readonly PORT = process.env.PORT
  public readonly CLIENT_URL = process.env.CLIENT_URL

  public server: Server
  
  private app: Application
  private database
  private router
  private socket

  constructor() {
    this.app = express()
    this.server = http.createServer(this.app)
    this.database = new DataBase()
    this.router = new Router(this.server)
    this.socket = new Socket(this.server)

    this.plugins()

    this.database.connect()
    this.socket.connect()
  }

  private plugins() {
    this.app.use(cookieParser())
    this.app.use(bodyParser.json())
    this.app.use(cors({ credentials: true, origin: this.CLIENT_URL }))
  }

  public start() {
    try {
      this.server.listen(this.PORT, () => console.log(`Server has been started on port ${this.PORT}`))
    } catch (error) {
      console.log(error)
      process.exit(1)
    }
  }

  // public async t() {
  //   const candidate = await DataBase.models.User.findOne({ username: 'ekudred' })

  //   if (candidate) {
  //     console.log('Candidate')

  //     return
  //   }

  //   await DataBase.models.User.create({
  //     email: 'example@gmail.com',
  //     username: 'ekudred',
  //     fullname: 'Full Name',
  //     password: 'password',
  //     birthdate: '11.11.1111',
  //     phone: '11111111111',
  //     avatar: 'http://abobfop.com/123refdcuuhwequcwfjowqrewcuqwocjeqcwijehquocwepjqwoekqorvwcejxk.jpg',
  //   })
  // }
}

export default App
