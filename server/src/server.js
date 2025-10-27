import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import { connectDatabase } from './config/database.js'
import authRouter from './routes/auth.js'
import gamesRouter from './routes/games.js'
import { authSocket } from './middleware/authSocket.js'
import { registerSocketHandlers } from './socket/handlers.js'

dotenv.config()

const app = express()
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }))
app.use(express.json())

app.use('/auth', authRouter)
app.use('/games', gamesRouter)

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: ['GET', 'POST']
  }
})

authSocket(io)
registerSocketHandlers(io)

const start = async () => {
  await connectDatabase(process.env.MONGO_URI)
  const port = process.env.PORT || 4000
  server.listen(port, () => {
    console.log(`[server] listening on ${port}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server', err)
  process.exit(1)
})
