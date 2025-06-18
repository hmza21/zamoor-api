import express from 'express'
import expressSession from 'express-session'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import mediaRoutes from './routes/media.js'
import usersRoutes from './routes/users.js'
import postsRoutes from './routes/posts.js'
import commentsRoutes from './routes/comments.js'
import repliesRoutes from './routes/replies.js'
import notificationsRoutes from './routes/notifications.js'
import chatsRoutes from './routes/chats.js'

import db from './db.js'

dotenv.config();

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use(expressSession({
  secret: 'test',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}))

app.use('/api/auth', authRoutes)
app.use('/api/media', mediaRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/comments', commentsRoutes)
app.use('/api/replies', repliesRoutes)
app.use('/api/notifications', notificationsRoutes)
app.use('/api/chats', chatsRoutes)

app.get('/', (req, res) => res.send('Welcome to the API'))

db.connect().then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
