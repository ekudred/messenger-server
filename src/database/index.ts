import { Sequelize } from 'sequelize-typescript'
import path from 'path'
import fs from 'fs'

import config, { Config } from './config'

class DataBase {
  public static models: any = {}

  constructor() {
    this.getModels()
  }

  private getModels() {
    fs.readdirSync(__dirname + '/models')
      .filter((file: string) => {
        return file.indexOf('.') !== 0 && file.slice(-9) === '.model.ts'
      })
      .forEach((file: any) => {
        const model = require(path.join(__dirname + '/models', file)).default
        DataBase.models[model.name] = model
      })
  }

  public async connect(): Promise<void> {
    const init = (config: Config) => {
      const { database, username, password, host, port } = config

      return new Sequelize(database, username, password, {
        dialect: 'postgres',
        host: host,
        port: port,
        // storage: ':memory:',
        models: [__dirname + '/models/**/*.model.ts'],
      })
    }

    const sequelize = init(config[String(process.env.NODE_ENV)])

    await sequelize.authenticate()
    await sequelize.sync()
  }
}

export default DataBase
