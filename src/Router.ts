import { useExpressServer } from 'routing-controllers'
import { Application } from 'express'

class Router {
  public static create(app: Application) {
    useExpressServer(app, {
      routePrefix: '/api',
      cors: { origin: process.env.CLIENT_URL, credentials: true },
      controllers: [__dirname + '/controllers/**/*.controller.ts'],
      // middlewares: [__dirname + '/middlewares/error.middleware.ts'],
    })
  }
}

export default Router
