import { useExpressServer } from 'routing-controllers'
import { Server } from 'http'
import path from 'path'

class Router {
  constructor(server: Server) {
    useExpressServer(server, {
      routePrefix: '/api',
      controllers: [path.join(__dirname + '/controllers/*.controller.ts')],
      // middlewares: []
    })
  }
}

export default Router
