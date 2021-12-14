class ErrorAPI extends Error {
  status
  errors

  constructor(status: number, message: string, errors = []) {
    super(message)

    this.status = status
    this.message = message
    this.errors = errors
  }

  public static badRequest(message: string, errors = []) {
    return new ErrorAPI(400, message, errors)
  }

  public static unAuthError() {
    return new ErrorAPI(401, 'User is not found')
  }

  public static forbidden() {
    return new ErrorAPI(403, 'No access')
  }
}

export default ErrorAPI
