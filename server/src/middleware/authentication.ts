import express from 'express'
import { prisma } from '../server'

const BYPASS_ROUTES = ['/login', '/register', '/avatars', '/reports']

export async function authentication(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
): Promise<any> {
  const route = request.url
  
  if (BYPASS_ROUTES.some((r) => route.startsWith(r))) {
    return next()
  }

  const bearer = request.headers.authorization
  const token = bearer?.split(' ')[1]

  if (!token) return response.status(401).json({ error: 'Token not provided' })

  const user = await prisma.user.findUnique({
    where: { token },
    select: { id: true }
  })

  if (!user) return response.status(401).send()

  request.sub = user.id

  return next()
}
