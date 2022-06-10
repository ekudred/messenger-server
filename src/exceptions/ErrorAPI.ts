interface ErrorAPIStatic {
  badRequest(message: string, errors: string[]): any
  unAuthError(): any
  forbidden(): any
}

function staticImplements<T>() {
  return <U extends T>(constructor: U) => constructor
}

@staticImplements<ErrorAPIStatic>()
class ErrorAPI extends Error {
  public status: number
  public errors: string[]

  constructor(status: number, message: string, errors: string[] = []) {
    super(message)

    this.status = status
    this.message = message
    this.errors = errors
  }

  static badRequest(message: string, errors: string[] = []) {
    return new ErrorAPI(400, message, errors)
  }

  static unAuthError(message: string = 'Unauthorized') {
    return new ErrorAPI(401, message)
  }

  static forbidden(message: string = 'No access') {
    return new ErrorAPI(403, message)
  }
}

export default ErrorAPI
