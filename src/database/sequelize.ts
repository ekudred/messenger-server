import { Sequelize } from 'sequelize-typescript'

import config, { Config } from './config'

const initSequelize = (config: Config) => {
  const { database, username, password, host, port, logging } = config

  const sequelize = new Sequelize(database, username, password, {
    dialect: 'postgres',
    host,
    port,
    models: [__dirname + '/models/*.model.ts'],
    logging,
  })

  return sequelize
}

const sequelize = initSequelize(config[String(process.env.NODE_ENV)])

export default sequelize
