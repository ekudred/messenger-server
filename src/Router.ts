import { useExpressServer } from 'routing-controllers'
import { Application } from 'express'
import path from 'path'

class Router {
  public static create(app: Application) {
    return useExpressServer(app, {
      routePrefix: '/api',
      cors: { credentials: true, origin: process.env.CLIENT_URL },
      controllers: [path.join(__dirname + '/controllers/*.controller.ts')],
      // middlewares: []
    })
  }
}

export default Router
