import path from 'path'
import fs from 'fs'
import chalk from 'chalk'

import sequelize from './sequelize'

class DataBase {
  public static models: { [key: string]: any } = this.getModels()

  private static getModels() {
    return sequelize.models
    // const modelsPath = __dirname + '/models'
    // const modelExtension = /model.ts$/
    //
    // const models = fs
    //   .readdirSync(modelsPath)
    //   .filter((filename: string) => modelExtension.test(filename))
    //   .reduce((total: any, filename: string) => {
    //     const model = require(path.join(modelsPath, filename)).default
    //     total[model.name] = model
    //     return total
    //   }, {})
    //
    // Object.keys(models).forEach((modelName: string) => {
    //   if ('associate' in models[modelName]) {
    //     models[modelName].associate(models)
    //   }
    // })
    //
    // return models
  }

  public async connect(): Promise<void> {
    try {
      await sequelize.authenticate()
      await sequelize.sync()

      console.log(chalk.magenta('Database'), chalk.green('connection successfully established'))
    } catch (error) {
      console.error(chalk.red('Unable to connect to the database:'), error)
    }
  }
}

export default DataBase
