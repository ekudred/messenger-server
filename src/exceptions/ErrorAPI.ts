interface IErrorAPI {
  status: number
  errors: string[]
}

interface IErrorAPIStatic {
  badRequest(message: string, errors: string[]): any
  unAuthError(): any
  forbidden(): any
}

function staticImplements<T>() {
  return <U extends T>(constructor: U) => constructor
}

@staticImplements<IErrorAPIStatic>()
class ErrorAPI extends Error implements IErrorAPI {
  public status: number
  public errors: string[]

  constructor(status: number, message: string, errors: string[] = []) {
    super(message)

    this.status = status
    this.message = message
    this.errors = errors
  }

  public static badRequest(message: string, errors: string[] = []) {
    return new ErrorAPI(400, message, errors)
  }

  public static unAuthError(message = 'Unauthorized') {
    return new ErrorAPI(401, message)
  }

  public static forbidden(message = 'No access') {
    return new ErrorAPI(403, message)
  }
}

export default ErrorAPI
