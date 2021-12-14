import { Model, UpdateWithAggregationPipeline, UpdateQuery, FilterQuery, NativeError, PopulateOptions } from 'mongoose'

export interface IMongoModel {
  create(doc: any): Promise<any>
  find(filter: FilterQuery<any>, callback?: (err: NativeError, doc: any) => void): Promise<any>
  findOne(filter: FilterQuery<any>, callback?: (err: NativeError, doc: any) => void): Promise<any>
  update(filter: FilterQuery<any>, update: UpdateWithAggregationPipeline | UpdateQuery<any>, callback?: (err: any, res: any) => void): Promise<any>
  updateOne(filter: FilterQuery<any>, update: UpdateWithAggregationPipeline | UpdateQuery<any>, callback?: (err: any, res: any) => void): Promise<any>
  delete(filter: FilterQuery<any>, callback?: (err: any, res: any) => void): Promise<any>
  deleteOne(filter: FilterQuery<any>, callback?: (err: any, res: any) => void): Promise<any>
  populate(docs: any[], options: string | PopulateOptions | PopulateOptions[], callback?: (err: any, res: any[]) => void): Promise<any>
}

// create read update delete

class MongoModel implements IMongoModel {
  public readonly DB_URL = process.env.DB_URL

  public model: Model<any, any, any>

  constructor(model: Model<any, any, any>) {
    this.model = model
  }

  public async create(doc: any): Promise<any> {
    return this.model.create(doc)
  }

  public async find(filter: FilterQuery<any>, callback?: (err: NativeError, doc: any) => void): Promise<any> {
    return this.model.find(filter, callback)
  }

  public async findOne(filter: FilterQuery<any>, callback?: (err: NativeError, doc: any) => void): Promise<any> {
    return this.model.findOne(filter, callback)
  }

  public async update(
    filter: FilterQuery<any>,
    update: UpdateWithAggregationPipeline | UpdateQuery<any>,
    callback?: (err: any, res: any) => void
  ): Promise<any> {
    return this.model.updateMany(filter, update, callback)
  }

  public async updateOne(
    filter: FilterQuery<any>,
    update: UpdateWithAggregationPipeline | UpdateQuery<any>,
    callback?: (err: any, res: any) => void
  ): Promise<any> {
    return this.model.updateOne(filter, update, callback)
  }

  public async delete(filter: FilterQuery<any>, callback?: (err: any, res: any) => void): Promise<any> {
    return this.model.deleteMany(filter, callback)
  }

  public async deleteOne(filter: FilterQuery<any>, callback?: (err: any, res: any) => void): Promise<any> {
    return this.model.deleteOne(filter, callback)
  }

  public async populate(docs: any[], options: string | PopulateOptions | PopulateOptions[], callback?: (err: any, res: any[]) => void): Promise<any> {
    return this.model.populate(docs, options, callback)
  }
}

export default MongoModel
