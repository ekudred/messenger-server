import { useExpressServer } from 'routing-controllers'
import { Application } from 'express'
import chalk from 'chalk'

class Router {
  public static create(app: Application) {
    useExpressServer(app, {
      routePrefix: '/api',
      cors: { origin: process.env.CLIENT_URL, credentials: true },
      controllers: [__dirname + '/controllers/router/*.router-controller.ts'],
    })

    console.log(chalk.magenta('Router'), chalk.green('is up and running'))
  }
}

export default Router
