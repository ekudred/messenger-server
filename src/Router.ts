import { Express } from 'express'
import { useExpressServer } from 'routing-controllers'
import path from 'path'

class Router {
  constructor(server: Express) {
    return useExpressServer(server, {
      routePrefix: '/api',
      cors: { credentials: true, origin: process.env.CLIENT_URL },
      controllers: [path.join(__dirname + '/controllers/*.controller.ts')],
      // middlewares: []
    })
  }
}

export default Router
