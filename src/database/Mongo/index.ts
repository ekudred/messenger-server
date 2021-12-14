import mongoose from 'mongoose'

import MongoModel from './Model'
import UserModel from './models/user.model'

class Mongo {
  public readonly DB_URL = process.env.DB_URL

  public static models = {
    User: new MongoModel(UserModel),
  }

  public async connect(): Promise<void> {
    await mongoose.connect(this.DB_URL!)
  }
}

export default Mongo
