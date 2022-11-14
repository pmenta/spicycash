export class RequiredParametersError extends Error {
  public _message: string
  public _statusCode: number

  constructor (message: string, statusCode = 500) {
    super(message)
    this._message = message
    this._statusCode = statusCode
  }
}
