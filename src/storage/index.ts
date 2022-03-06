import { S3 } from 'aws-sdk'

type ContentEncoding = string // 'base64'
type ContentType = string // 'image/png'

interface UploadParams {
  path: string
  body: string | Buffer
  contentEncoding: ContentEncoding
  contentType: ContentType
}
interface getParams {
  filename: string
}

class Storage {
  private client: S3

  constructor() {
    this.client = new S3({
      region: process.env.REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    })
  }

  public async get(params: getParams) {
    const { filename } = params

    const data = await this.client.getObject({ Bucket: process.env.AWS_BUCKET!, Key: filename }).promise()
    // this.client.get()

    console.log(data)
  }

  public async upload(params: UploadParams) {
    const { path, body, contentEncoding, contentType } = params

    const uploadOptions = {
      Bucket: process.env.AWS_BUCKET!,
      Key: path,
      Body: body,
      ContentEncoding: contentEncoding,
      ContentType: contentType,
    }

    const data = await this.client.upload(uploadOptions).promise()

    return data
  }

  public async deleteFile() {}
}

export default Storage
