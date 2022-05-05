import express, { Application } from 'express'
import { Server as HTTPServer } from 'http'

import Server from './server'
import Router from './router'
import Socket from './socket'
import DataBase from './database'

import chalk from 'chalk'

class App {
  private app: Application
  private server: HTTPServer
  private database: DataBase

  constructor() {
    this.app = express()
    this.server = Server.create(this.app)

    this.database = new DataBase()
    this.database.connect()

    Router.create(this.app)
    Socket.create(this.server)
  }

  public start() {
    try {
      this.server.listen(process.env.PORT, () =>
        console.log(chalk.magenta('App'), chalk.green('has been started on port'), chalk.underline.green(process.env.PORT))
      )
    } catch (error) {
      console.log(error)
      process.exit(1)
    }
  }
}

export default App
