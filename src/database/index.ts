import Mongo from './Mongo'

class DataBase {
  private mongo

  constructor() {
    this.mongo = new Mongo()
  }

  public static models = Mongo.models

  public async connect(): Promise<void> {
    await this.mongo.connect()
  }
}

export default DataBase
