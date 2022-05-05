import http from 'http'
import { Application } from 'express'

class Server {
  public static create(app: Application) {
    return http.createServer(app)
  }
}

export default Server
