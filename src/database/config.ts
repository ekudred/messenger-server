export interface Config {
  database: string
  username: string
  password: string
  host: string
  port: number
  logging: boolean
}

const config: { [key: string]: Config } = {
  development: {
    database: String(process.env.DEV_DB_NAME),
    username: String(process.env.DEV_DB_USER),
    password: String(process.env.DEV_DB_PASSWORD),
    host: String(process.env.DEV_DB_HOST),
    port: Number(process.env.DEV_DB_PORT),
    logging: false
  },
  // production: {
  //   database: 'database_production',
  //   username: 'root',
  //   password: null,
  //   host: '127.0.0.1',
  //   port: 1234,
  //   logging: false
  // },
}

export default config
