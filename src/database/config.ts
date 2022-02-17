export interface Config {
  database: string
  username: string
  password: string
  host: string
  port: number
}

const config: { [key: string]: Config } = {
  development: {
    database: String(process.env.DB_NAME),
    username: String(process.env.DB_USER),
    password: String(process.env.DB_PASSWORD),
    host: String(process.env.DB_HOST),
    port: Number(process.env.DB_PORT),
  },
  // production: {
  //   database: 'database_production',
  //   username: 'root',
  //   password: null,
  //   host: '127.0.0.1',
  //   port: 1234,
  // },
}

export default config