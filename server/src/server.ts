import cors from 'cors'
import express from 'express'
import multer from 'multer'

import { PrismaClient } from '@prisma/client'
import { env } from './config/env'

import multerConfig from './config/multer'
import { createActivity, deleteActivity } from './services/activity.js'
import { changeReport } from './services/reports'
import { changeAvatar, changeType, getUserById, getUserByToken, getUsers, login, register } from './services/user'
import { authentication } from './middleware/authentication'

const app = express()
export const prisma = new PrismaClient()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => authentication(req, res, next))

app.use('/avatars', express.static(multerConfig.destination))
app.use('/reports', express.static(multerConfig.reports))

app.get('/users', (request, response) => getUsers(request, response))
app.get('/token', (request, response) => getUserByToken(request, response))
app.get('/id/:id', (request, response) => getUserById(request, response))

app.post('/login', (request, response) => login(request, response))
app.post('/register', (request, response) => register(request, response))
app.post('/activity', (request, response) => createActivity(request, response))
app.post('/type', (request, response) => changeType(request, response))

app.post('/avatar', multer(multerConfig).single('file'), (request, response) => changeAvatar(request, response))
app.post('/report', multer(multerConfig).single('file'), (request, response) => changeReport(request, response))

app.delete('/activity/:id', (request, response) => deleteActivity(request, response))

app.listen(env.PORT, () => console.log(`🚀 Server running on port ${env.PORT}!`))
