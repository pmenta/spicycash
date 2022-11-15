import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

interface IPayload {
  sub: string
}

export function ensureAuthenticated (
  request: Request,
  response: Response,
  next: NextFunction
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
): Response | void {
  const token = request.headers.authorization

  if (!token) {
    return response.status(401).end()
  }

  try {
    const { sub } = verify(
      token.substring(7),
      process.env.SECRET as string
    ) as IPayload

    request.userId = sub
  } catch {
    return response.status(401).end()
  }

  return next()
}
